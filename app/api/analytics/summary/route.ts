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

function getPreviousRange(from: Date, to: Date) {
	const duration = to.getTime() - from.getTime()
	const prevTo = new Date(from.getTime() - 1)
	const prevFrom = new Date(prevTo.getTime() - duration)
	return { from: prevFrom, to: prevTo }
}

function calcChange(current: number, previous: number) {
	if (previous <= 0) return current > 0 ? 100 : 0
	return Math.round(((current - previous) / previous) * 100)
}

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id

	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const period = parsePeriod(req)
	const { from, to } = getRange(period)
	const { from: prevFrom, to: prevTo } = getPreviousRange(from, to)
	const activeLinkWhere = {
		userId,
		deletedAt: null as null,
		status: 'active' as const,
		OR: [{ expiresAt: null }, { expiresAt: { gt: to } }]
	}
	const previousActiveLinkWhere = {
		userId,
		deletedAt: null as null,
		status: 'active' as const,
		OR: [{ expiresAt: null }, { expiresAt: { gt: prevTo } }]
	}
	const eventWhere = {
		clickedAt: { gte: from, lte: to },
		link: {
			userId,
			deletedAt: null as null
		}
	}
	const previousEventWhere = {
		clickedAt: { gte: prevFrom, lte: prevTo },
		link: {
			userId,
			deletedAt: null as null
		}
	}

	const [
		totalClicks,
		prevTotalClicks,
		activeLinks,
		prevActiveLinks,
		topLinkClicks,
		prevTopLinkClicks,
		qrScans,
		prevQrScans
	] = await Promise.all([
		prisma.linkClickEvent.count({ where: eventWhere }),
		prisma.linkClickEvent.count({ where: previousEventWhere }),
		prisma.link.count({ where: activeLinkWhere }),
		prisma.link.count({ where: previousActiveLinkWhere }),
		prisma.linkClickEvent.groupBy({
			by: ['linkId'],
			where: eventWhere,
			_count: { linkId: true },
			orderBy: { _count: { linkId: 'desc' } },
			take: 1
		}),
		prisma.linkClickEvent.groupBy({
			by: ['linkId'],
			where: previousEventWhere,
			_count: { linkId: true },
			orderBy: { _count: { linkId: 'desc' } },
			take: 1
		}),
		prisma.linkClickEvent.count({
			where: {
				...eventWhere,
				source: 'qr'
			}
		}),
		prisma.linkClickEvent.count({
			where: {
				...previousEventWhere,
				source: 'qr'
			}
		})
	])
	const topCurrent = topLinkClicks[0]?._count.linkId ?? 0
	const topPrevious = prevTopLinkClicks[0]?._count.linkId ?? 0

	return NextResponse.json({
		period,
		stats: [
			{
				id: 'clicks',
				value: formatNumber(totalClicks),
				change: calcChange(totalClicks, prevTotalClicks)
			},
			{
				id: 'links',
				value: formatNumber(activeLinks),
				change: calcChange(activeLinks, prevActiveLinks)
			},
			{
				id: 'top',
				value: formatNumber(topCurrent),
				change: calcChange(topCurrent, topPrevious)
			},
			{
				id: 'qr',
				value: formatNumber(qrScans),
				change: calcChange(qrScans, prevQrScans)
			}
		]
	})
}
