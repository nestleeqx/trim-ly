import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
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

	if (action !== 'pause' && action !== 'resume') {
		return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
	}

	const existing = await prisma.link.findFirst({
		where: { id, userId, deletedAt: null },
		select: { id: true, expiresAt: true }
	})

	if (!existing) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	if (
		existing.expiresAt &&
		existing.expiresAt.getTime() <= Date.now() &&
		action === 'resume'
	) {
		return NextResponse.json(
			{ error: 'Cannot resume expired link' },
			{ status: 400 }
		)
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
