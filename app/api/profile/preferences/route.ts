import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

const ALLOWED_THEMES = new Set(['light', 'dark', 'system'] as const)
type ThemeValue = 'light' | 'dark' | 'system'

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { theme: true }
	})

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	return NextResponse.json({ theme: user.theme })
}

export async function PATCH(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const themeRaw = String(body?.theme ?? '') as ThemeValue

	if (!ALLOWED_THEMES.has(themeRaw)) {
		return NextResponse.json(
			{ error: 'Invalid theme value' },
			{ status: 400 }
		)
	}

	const updated = await prisma.user.update({
		where: { id: userId },
		data: { theme: themeRaw },
		select: { theme: true }
	})

	return NextResponse.json(updated)
}
