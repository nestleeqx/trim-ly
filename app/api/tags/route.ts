import { Prisma } from '@/app/generated/prisma/client'
import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

function slugifyTagName(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-zа-я0-9\s-_]/gi, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
}

export async function GET() {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const tags = await prisma.tag.findMany({
		where: { userId },
		orderBy: { name: 'asc' },
		select: {
			id: true,
			name: true,
			slug: true,
			createdAt: true
		}
	})

	return NextResponse.json({ tags })
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const name = String(body?.name ?? '').trim()

	if (!name) {
		return NextResponse.json({ error: 'Tag name is required' }, { status: 400 })
	}

	if (name.length > 20) {
		return NextResponse.json(
			{ error: 'Tag name is too long (max 20)' },
			{ status: 400 }
		)
	}

	const slug = slugifyTagName(name)
	if (!slug) {
		return NextResponse.json({ error: 'Invalid tag name' }, { status: 400 })
	}

	try {
		const created = await prisma.tag.create({
			data: {
				userId,
				name,
				slug
			},
			select: { id: true, name: true, slug: true, createdAt: true }
		})
		return NextResponse.json({ tag: created, existed: false }, { status: 201 })
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			const existing = await prisma.tag.findUnique({
				where: {
					userId_slug: {
						userId,
						slug
					}
				},
				select: { id: true, name: true, slug: true, createdAt: true }
			})

			if (existing) {
				return NextResponse.json({ tag: existing, existed: true })
			}
		}
		return NextResponse.json({ error: 'Internal error' }, { status: 500 })
	}
}
