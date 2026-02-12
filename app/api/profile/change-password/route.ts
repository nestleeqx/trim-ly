import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { cleanupRateLimitStore, rateLimit } from '@/lib/rateLimit'
import { getRequestIp } from '@/lib/requestIp'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const currentPassword = String(body?.currentPassword ?? '')
	const newPassword = String(body?.newPassword ?? '')

	if (!currentPassword || !newPassword) {
		return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
	}

	if (newPassword.length < 8 || newPassword.length > 128) {
		return NextResponse.json(
			{ error: 'Invalid new password' },
			{ status: 400 }
		)
	}

	if (newPassword === currentPassword) {
		return NextResponse.json(
			{ error: 'New password must differ from current password' },
			{ status: 400 }
		)
	}

	const ip = getRequestIp()
	cleanupRateLimitStore()

	const rl = rateLimit({
		key: `change-password:${ip}:${userId}`,
		limit: 10,
		windowMs: 15 * 60 * 1000
	})

	if (!rl.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Try again later.' },
			{ status: 429 }
		)
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { passwordHash: true }
	})

	if (!user?.passwordHash) {
		return NextResponse.json(
			{ error: 'Invalid credentials' },
			{ status: 400 }
		)
	}

	const isCurrentValid = await bcrypt.compare(
		currentPassword,
		user.passwordHash
	)
	if (!isCurrentValid) {
		return NextResponse.json(
			{ error: 'Invalid credentials' },
			{ status: 400 }
		)
	}

	const passwordHash = await bcrypt.hash(newPassword, 10)

	await prisma.user.update({
		where: { id: userId },
		data: { passwordHash }
	})

	return NextResponse.json({ ok: true })
}
