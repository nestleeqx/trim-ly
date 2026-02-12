import { validateProfile } from '@/app/features/profile/validation/profileValidation'
import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			name: true,
			username: true,
			email: true,
			avatarURL: true
		}
	})

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	return NextResponse.json(user)
}

export async function PATCH(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const name = String(body?.name ?? '')
	const username = String(body?.username ?? '')

	const result = validateProfile({ name, username })
	const errors = result.errors
	if (Object.keys(errors).length > 0) {
		return NextResponse.json(
			{ error: 'Validation error', errors },
			{ status: 400 }
		)
	}

	const normalizedName = result.normalized.name
	const normalizedUsername = result.normalized.username

	const existingByUsername = await prisma.user.findUnique({
		where: { username: normalizedUsername },
		select: { id: true }
	})

	if (existingByUsername && existingByUsername.id !== userId) {
		return NextResponse.json(
			{
				error: 'Username already taken',
				errors: { username: 'Username уже занят.' }
			},
			{ status: 409 }
		)
	}

	const updated = await prisma.user.update({
		where: { id: userId },
		data: {
			name: normalizedName,
			username: normalizedUsername
		},
		select: {
			name: true,
			username: true,
			email: true,
			avatarURL: true
		}
	})

	return NextResponse.json(updated)
}
