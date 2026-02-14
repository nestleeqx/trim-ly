import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type AnalyticsPeriod = '24h' | '7d' | '30d' | '90d'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

function formatNumber(value: number) {
	return value.toLocaleString('ru-RU')
}

function parsePeriod(req: Request): AnalyticsPeriod {
	const raw = (new URL(req.url).searchParams.get('period') || '24h').trim()
	if (raw === '7d' || raw === '30d' || raw === '90d') return raw
	return '24h'
}

function getRange(period: AnalyticsPeriod) {
	const to = new Date()
	if (period === '24h') {
		return { from: new Date(to.getTime() - DAY_MS), to }
	}
	const days = period === '90d' ? 90 : period === '30d' ? 30 : 7
	return { from: new Date(to.getTime() - days * DAY_MS), to }
}

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const period = parsePeriod(req)
	const { from, to } = getRange(period)
	const activeLinkWhere = {
		userId,
		deletedAt: null as null,
		status: 'active' as const,
		OR: [{ expiresAt: null }, { expiresAt: { gt: to } }]
	}
	const eventWhere = {
		clickedAt: { gte: from, lte: to },
		link: {
			userId,
			deletedAt: null as null
		}
	}

	const [totalClicks, activeLinks, topLinkClicks, qrScans] = await Promise.all([
		prisma.linkClickEvent.count({ where: eventWhere }),
		prisma.link.count({ where: activeLinkWhere }),
		prisma.linkClickEvent.groupBy({
			by: ['linkId'],
			where: eventWhere,
			_count: { linkId: true },
			orderBy: { _count: { linkId: 'desc' } },
			take: 1
		}),
		prisma.linkClickEvent.count({
			where: {
				...eventWhere,
				OR: [
					{ referrer: { contains: 'utm_source=qr', mode: 'insensitive' } },
					{ referrer: { contains: 'qrcode', mode: 'insensitive' } },
					{ referrer: { contains: '/qr', mode: 'insensitive' } }
				]
			}
		})
	])

	return NextResponse.json({
		period,
		stats: [
			{ id: 'clicks', value: formatNumber(totalClicks), change: 0 },
			{ id: 'links', value: formatNumber(activeLinks), change: 0 },
			{
				id: 'top',
				value: formatNumber(topLinkClicks[0]?._count.linkId ?? 0),
				change: 0
			},
			{ id: 'qr', value: formatNumber(qrScans), change: 0 }
		]
	})
}
