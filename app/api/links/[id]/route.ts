import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

const SHORT_LINK_DOMAIN = 't.ly/'

function mapStatus(params: {
	status: 'active' | 'disabled' | 'expired'
	expiresAt: Date | null
	deletedAt: Date | null
}) {
	if (params.deletedAt) return 'deleted'
	if (params.expiresAt && params.expiresAt.getTime() <= Date.now()) {
		return 'expired'
	}
	if (params.status === 'disabled') return 'paused'
	if (params.status === 'expired') return 'expired'
	return 'active'
}

export async function GET(_: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params

	if (!id) {
		return NextResponse.json({ error: 'Invalid link id' }, { status: 400 })
	}

	const link = await prisma.link.findFirst({
		where: { id, userId },
		select: {
			id: true,
			title: true,
			slug: true,
			targetUrl: true,
			clicksTotal: true,
			status: true,
			createdAt: true,
			expiresAt: true,
			deletedAt: true,
			passwordHash: true,
			tags: {
				select: {
					tag: {
						select: {
							name: true
						}
					}
				}
			}
		}
	})

	if (!link) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	return NextResponse.json({
		link: {
			id: link.id,
			title: link.title || 'Без названия',
			shortUrl: `${SHORT_LINK_DOMAIN}${link.slug}`,
			destination: link.targetUrl,
			clicks: link.clicksTotal,
			status: mapStatus({
				status: link.status,
				expiresAt: link.expiresAt,
				deletedAt: link.deletedAt
			}),
			tags: link.tags.map(tagRel => tagRel.tag.name),
			createdAt: link.createdAt.toISOString(),
			expirationDate: link.expiresAt?.toISOString() ?? null,
			hasPassword: !!link.passwordHash
		}
	})
}

export async function PATCH(req: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params
	const body = await req.json().catch(() => null)
	const action = String(body?.action ?? '')

	if (!id) {
		return NextResponse.json({ error: 'Invalid link id' }, { status: 400 })
	}

	if (action !== 'pause' && action !== 'resume' && action !== 'restore') {
		return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
	}

	if (action === 'restore') {
		const existingDeleted = await prisma.link.findFirst({
			where: { id, userId, deletedAt: { not: null } },
			select: { id: true }
		})

		if (!existingDeleted) {
			return NextResponse.json({ error: 'Link not found' }, { status: 404 })
		}

		await prisma.$transaction([
			prisma.link.update({
				where: { id },
				data: { deletedAt: null, status: 'active' }
			}),
			prisma.userUsage.update({
				where: { userId },
				data: { linksCreated: { increment: 1 } }
			})
		])

		return NextResponse.json({ ok: true })
	}

	const existing = await prisma.link.findFirst({
		where: { id, userId, deletedAt: null },
		select: { id: true }
	})

	if (!existing) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	const nextStatus = action === 'pause' ? 'disabled' : 'active'

	await prisma.link.update({
		where: { id },
		data: { status: nextStatus }
	})

	return NextResponse.json({ ok: true })
}

export async function DELETE(_: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params

	if (!id) {
		return NextResponse.json({ error: 'Invalid link id' }, { status: 400 })
	}

	const existing = await prisma.link.findFirst({
		where: { id, userId, deletedAt: null },
		select: { id: true }
	})

	if (!existing) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	await prisma.$transaction([
		prisma.link.update({
			where: { id },
			data: {
				deletedAt: new Date(),
				status: 'disabled'
			}
		}),
		prisma.userUsage.update({
			where: { userId },
			data: { linksCreated: { decrement: 1 } }
		})
	])

	return NextResponse.json({ ok: true })
}
