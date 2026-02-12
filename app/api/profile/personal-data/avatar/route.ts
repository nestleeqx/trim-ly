import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

function isValidHttpUrl(value: string) {
	try {
		const url = new URL(value)
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const avatarURL = String(body?.avatarURL ?? '').trim()

	if (!avatarURL) {
		return NextResponse.json(
			{ error: 'avatarURL is required' },
			{ status: 400 }
		)
	}

	if (!isValidHttpUrl(avatarURL)) {
		return NextResponse.json(
			{ error: 'Invalid avatar URL' },
			{ status: 400 }
		)
	}

	const updated = await prisma.user.update({
		where: { id: userId },
		data: { avatarURL },
		select: { avatarURL: true }
	})

	return NextResponse.json(updated)
}

export async function DELETE() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	await prisma.user.update({
		where: { id: userId },
		data: { avatarURL: null }
	})

	return NextResponse.json({ ok: true })
}
