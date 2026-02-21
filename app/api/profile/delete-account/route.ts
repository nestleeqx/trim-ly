import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

async function resolveUserAuthInfo(userId: string) {
	return prisma.user.findUnique({
		where: { id: userId },
		select: { passwordHash: true }
	})
}

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const user = await resolveUserAuthInfo(userId)
	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	return NextResponse.json({
		requiresPassword: Boolean(user.passwordHash)
	})
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const password = String(body?.password ?? '')
	const confirmationText = String(body?.confirmationText ?? '').trim()

	const user = await resolveUserAuthInfo(userId)
	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	if (user.passwordHash) {
		if (!password) {
			return NextResponse.json(
				{ error: 'Password is required' },
				{ status: 400 }
			)
		}

		const ok = await bcrypt.compare(password, user.passwordHash)
		if (!ok) {
			return NextResponse.json(
				{ error: 'Invalid password' },
				{ status: 400 }
			)
		}
	} else {
		if (!confirmationText) {
			return NextResponse.json(
				{ error: 'Confirmation text is required' },
				{ status: 400 }
			)
		}
		if (confirmationText !== 'DELETE') {
			return NextResponse.json(
				{ error: 'Invalid confirmation text' },
				{ status: 400 }
			)
		}
	}

	await prisma.user.delete({ where: { id: userId } })

	return NextResponse.json({ ok: true })
}
