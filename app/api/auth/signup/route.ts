import { Prisma } from '@/app/generated/prisma/client'
import { generateUniqueUsername } from '@/lib/auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

function normalizeEmail(email: string) {
	return email.trim().toLowerCase()
}

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => null)
		if (!body) {
			return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
		}

		const rawEmail = String(body.email ?? '')
		const password = String(body.password ?? '')
		const name = body.name ? String(body.name).trim() : null
		const email = normalizeEmail(rawEmail)

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 })
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
		}
		if (!password) {
			return NextResponse.json(
				{ error: 'Password is required' },
				{ status: 400 }
			)
		}
		if (password.length < 8) {
			return NextResponse.json(
				{ error: 'Password must be at least 8 characters' },
				{ status: 400 }
			)
		}
		if (password.length > 128) {
			return NextResponse.json(
				{ error: 'Password is too long' },
				{ status: 400 }
			)
		}

		const passwordHash = await bcrypt.hash(password, 10)
		const baseForUsername = name || email.split('@')[0]
		const username = await generateUniqueUsername(baseForUsername)

		const user = await prisma.$transaction(async tx => {
			const createdUser = await tx.user.create({
				data: {
					email,
					passwordHash,
					name,
					username,
					planId: 'free',
					subscriptionStatus: 'active'
				}
			})

			await tx.userUsage.create({
				data: { userId: createdUser.id }
			})

			return createdUser
		})

		return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return NextResponse.json(
					{ error: 'Такой пользователь уже существует' },
					{ status: 409 }
				)
			}
		}
		return NextResponse.json({ error: 'Internal error' }, { status: 500 })
	}
}
