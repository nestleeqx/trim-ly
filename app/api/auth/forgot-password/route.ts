import { sendPasswordResetEmail } from '@/lib/email/resent'
import prisma from '@/lib/prisma'
import { cleanupRateLimitStore, rateLimit } from '@/lib/rateLimit'
import { getRequestIp } from '@/lib/requestIp'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

const TOKEN_TTL_MIN = 30
const DEMO_EMAIL_MODE = process.env.AUTH_EMAIL_DEMO_MODE === 'true'

function hashToken(token: string) {
	return crypto.createHash('sha256').update(token).digest('hex')
}

export async function POST(req: Request) {
	const body = await req.json().catch(() => null)
	const emailRaw = String(body?.email ?? '')
		.trim()
		.toLowerCase()

	if (!emailRaw) {
		return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
	}

	const ip = getRequestIp()
	const key = `forgot:${ip}:${emailRaw}`

	cleanupRateLimitStore()
	const rl = rateLimit({ key, limit: 5, windowMs: 15 * 60 * 1000 })

	if (!rl.ok) {
		return NextResponse.json(
			{ error: 'Too many requests. Try again later.' },
			{ status: 429 }
		)
	}

	const okResponse = NextResponse.json({ ok: true })

	const user = await prisma.user.findUnique({ where: { email: emailRaw } })
	if (!user || !user.passwordHash) return okResponse

	const rawToken = crypto.randomBytes(32).toString('hex')
	const tokenHash = hashToken(rawToken)

	await prisma.$transaction([
		prisma.passwordResetToken.deleteMany({
			where: {
				userId: user.id,
				usedAt: null
			}
		}),
		prisma.passwordResetToken.create({
			data: {
				userId: user.id,
				tokenHash,
				expiresAt: new Date(Date.now() + TOKEN_TTL_MIN * 60 * 1000)
			}
		})
	])

	const baseUrl = process.env.NEXTAUTH_URL
	if (!baseUrl) {
		console.warn('[auth][forgot-password] NEXTAUTH_URL is not configured')
		return okResponse
	}

	const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`

	if (DEMO_EMAIL_MODE) {
		console.info(
			`[auth][forgot-password][demo] Reset link for ${user.email}: ${resetUrl}`
		)
		return okResponse
	}

	try {
		await sendPasswordResetEmail({
			to: user.email,
			resetUrl
		})
	} catch (error) {
		console.error(
			'[auth][forgot-password] Failed to send reset email',
			error
		)
	}

	return okResponse
}
