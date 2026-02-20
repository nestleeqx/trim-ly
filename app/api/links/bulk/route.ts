import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type BulkAction = 'pause' | 'resume' | 'delete' | 'restore'

const MAX_BULK_IDS = 200

function parseIds(raw: unknown): string[] {
	if (!Array.isArray(raw)) return []
	return raw.filter((id): id is string => typeof id === 'string' && !!id)
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await req.json().catch(() => null)
	const action = String(body?.action ?? '') as BulkAction
	const ids = [...new Set(parseIds(body?.ids))]

	if (!['pause', 'resume', 'delete', 'restore'].includes(action)) {
		return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
	}

	if (ids.length === 0 || ids.length > MAX_BULK_IDS) {
		return NextResponse.json({ error: 'Invalid ids' }, { status: 400 })
	}

	const ownedLinks = await prisma.link.findMany({
		where:
			action === 'restore'
				? {
						id: { in: ids },
						userId,
						deletedAt: { not: null }
					}
				: {
						id: { in: ids },
						userId,
						deletedAt: null
					},
		select: { id: true }
	})

	if (ownedLinks.length !== ids.length) {
		return NextResponse.json(
			{ error: 'Some links are invalid' },
			{ status: 400 }
		)
	}

	if (action === 'pause') {
		const result = await prisma.link.updateMany({
			where: { id: { in: ids }, userId, deletedAt: null },
			data: { status: 'disabled' }
		})

		return NextResponse.json({ ok: true, affected: result.count })
	}

	if (action === 'resume') {
		const result = await prisma.link.updateMany({
			where: {
				id: { in: ids },
				userId,
				deletedAt: null
			},
			data: { status: 'active' }
		})

		return NextResponse.json({ ok: true, affected: result.count })
	}

	if (action === 'restore') {
		try {
			const affected = await prisma.$transaction(async tx => {
				const userWithPlan = await tx.user.findUnique({
					where: { id: userId },
					select: { plan: { select: { linksLimit: true } } }
				})
				if (!userWithPlan?.plan) return 0

				const result = await tx.link.updateMany({
					where: {
						id: { in: ids },
						userId,
						deletedAt: { not: null }
					},
					data: { deletedAt: null, status: 'active' }
				})

				if (result.count > 0) {
					await tx.userUsage.upsert({
						where: { userId },
						create: {
							userId,
							linksCreated: 0,
							clicksTotal: 0
						},
						update: {}
					})

					const reserveSlots = await tx.userUsage.updateMany({
						where: {
							userId,
							linksCreated: {
								lte: userWithPlan.plan.linksLimit - result.count
							}
						},
						data: { linksCreated: { increment: result.count } }
					})

					if (reserveSlots.count === 0) {
						throw new Error('Links limit reached')
					}
				}

				return result.count
			})

			return NextResponse.json({ ok: true, affected })
		} catch (error) {
			if (
				error instanceof Error &&
				error.message === 'Links limit reached'
			) {
				return NextResponse.json(
					{ error: 'Links limit reached' },
					{ status: 403 }
				)
			}
			throw error
		}
	}

	const now = new Date()
	const affected = await prisma.$transaction(async tx => {
		const result = await tx.link.updateMany({
			where: { id: { in: ids }, userId, deletedAt: null },
			data: { deletedAt: now, status: 'disabled' }
		})

		if (result.count > 0) {
			await tx.userUsage.upsert({
				where: { userId },
				create: {
					userId,
					linksCreated: 0,
					clicksTotal: 0
				},
				update: { linksCreated: { decrement: result.count } }
			})
		}

		return result.count
	})

	return NextResponse.json({ ok: true, affected })
}
