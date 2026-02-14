import prisma from '@/lib/prisma'
import {
	getSoftDeleteCutoffDate,
	getSoftDeleteRetentionDays
} from '@/lib/links/deletionPolicy'
import { NextResponse } from 'next/server'

const PURGE_BATCH_SIZE = 500

function isAuthorized(req: Request) {
	const expectedSecret = process.env.CRON_SECRET
	const authHeader = req.headers.get('authorization') || ''
	const bearer = authHeader.replace(/^Bearer\s+/i, '')
	const isVercelCron = req.headers.get('x-vercel-cron') === '1'

	if (expectedSecret) {
		return bearer === expectedSecret
	}

	return isVercelCron
}

async function purgeHandler(req: Request) {
	if (!isAuthorized(req)) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const cutoff = getSoftDeleteCutoffDate()
	let deletedLinks = 0

	while (true) {
		const ids = await prisma.link.findMany({
			where: {
				deletedAt: {
					not: null,
					lte: cutoff
				}
			},
			select: { id: true },
			take: PURGE_BATCH_SIZE
		})

		if (ids.length === 0) break

		const result = await prisma.link.deleteMany({
			where: {
				id: { in: ids.map(item => item.id) }
			}
		})

		deletedLinks += result.count

		if (ids.length < PURGE_BATCH_SIZE) break
	}

	return NextResponse.json({
		ok: true,
		deletedLinks,
		retentionDays: getSoftDeleteRetentionDays(),
		cutoff: cutoff.toISOString()
	})
}

export async function GET(req: Request) {
	return purgeHandler(req)
}

export async function POST(req: Request) {
	return purgeHandler(req)
}
