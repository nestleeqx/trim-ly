import prisma from '@/lib/prisma'
import { cleanupRateLimitStore, rateLimit } from '@/lib/rateLimit'
import { getRequestIp } from '@/lib/requestIp'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

function hashToken(token: string) {
	return crypto.createHash('sha256').update(token).digest('hex')
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const tokenRaw = String(searchParams.get('token') ?? '')

	if (!tokenRaw) {
		return NextResponse.json({ error: 'Missing token' }, { status: 400 })
	}

	const tokenHash = hashToken(tokenRaw)
	const record = await prisma.passwordResetToken.findUnique({
		where: { tokenHash }
	})

	if (!record) {
		return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
	}

	if (record.usedAt) {
		return NextResponse.json(
			{ error: 'Token already used' },
			{ status: 400 }
		)
	}

	if (record.expiresAt.getTime() < Date.now()) {
		return NextResponse.json({ error: 'Token expired' }, { status: 400 })
	}

	return NextResponse.json({ ok: true })
}

export async function POST(req: Request) {
	const body = await req.json().catch(() => null)

	const tokenRaw = String(body?.token ?? '')
	const password = String(body?.password ?? '')

	if (!tokenRaw || !password) {
		return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
	}

	const ip = getRequestIp()
	cleanupRateLimitStore()

	const tokenHashPrefix = crypto
		.createHash('sha256')
		.update(tokenRaw)
		.digest('hex')
		.slice(0, 12)

	const rl = rateLimit({
		key: `reset:${ip}:${tokenHashPrefix}`,
		limit: 10,
		windowMs: 15 * 60 * 1000
	})

	if (!rl.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Try again later.' },
			{ status: 429 }
		)
	}

	if (password.length < 8) {
		return NextResponse.json(
			{ error: 'Password must be at least 8 characters' },
			{ status: 400 }
		)
	}

	const tokenHash = hashToken(tokenRaw)

	const record = await prisma.passwordResetToken.findUnique({
		where: { tokenHash }
	})

	if (!record) {
		return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
	}

	if (record.usedAt) {
		return NextResponse.json(
			{ error: 'Token already used' },
			{ status: 400 }
		)
	}

	if (record.expiresAt.getTime() < Date.now()) {
		return NextResponse.json({ error: 'Token expired' }, { status: 400 })
	}

	const passwordHash = await bcrypt.hash(password, 10)

	await prisma.$transaction([
		prisma.user.update({
			where: { id: record.userId },
			data: { passwordHash }
		}),
		prisma.passwordResetToken.update({
			where: { id: record.id },
			data: { usedAt: new Date() }
		}),
		prisma.passwordResetToken.updateMany({
			where: {
				userId: record.userId,
				usedAt: null,
				id: { not: record.id }
			},
			data: { usedAt: new Date() }
		})
	])

	return NextResponse.json({ ok: true })
}
