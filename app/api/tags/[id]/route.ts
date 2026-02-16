import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

export async function DELETE(_: Request, context: RouteContext) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await context.params
	if (!id) {
		return NextResponse.json({ error: 'Tag id is required' }, { status: 400 })
	}

	const tag = await prisma.tag.findFirst({
		where: { id, userId },
		select: { id: true }
	})

	if (!tag) {
		return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
	}

	await prisma.tag.delete({ where: { id } })

	return NextResponse.json({ ok: true })
}
