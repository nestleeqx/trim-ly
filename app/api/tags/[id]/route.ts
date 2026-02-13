import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type Params = { params: { id: string } }

export async function DELETE(_: Request, { params }: Params) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const id = params.id
	if (!id) {
		return NextResponse.json(
			{ error: 'Tag id is required' },
			{ status: 400 }
		)
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
