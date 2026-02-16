import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type RouteContext = {
	params: Promise<{ id: string }>
}

type Period = '7d' | '30d' | '90d' | 'custom'

const DAY_MS = 24 * 60 * 60 * 1000

function parsePeriod(req: Request): Period {
	const raw = (new URL(req.url).searchParams.get('period') || '7d').trim()
	if (raw === '30d' || raw === '90d' || raw === 'custom') return raw
	return '7d'
}

function parseDate(value: string | null, endOfDay = false) {
	if (!value) return null
	const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value)
	const date = isDateOnly
		? new Date(
				endOfDay
					? `${value}T23:59:59.999Z`
					: `${value}T00:00:00.000Z`
			)
		: new Date(value)
	if (Number.isNaN(date.getTime())) return null
	return date
}

function getRange(req: Request, period: Period) {
	const now = new Date()
	const to = now

	if (period === 'custom') {
		const url = new URL(req.url)
		const fromParam = parseDate(url.searchParams.get('from'))
		const toParam = parseDate(url.searchParams.get('to'), true)
		const from = fromParam || new Date(now.getTime() - 6 * DAY_MS)
		return { from, to: toParam || now }
	}

	const days = period === '90d' ? 90 : period === '30d' ? 30 : 7
	const from = new Date(to)
	from.setUTCHours(0, 0, 0, 0)
	from.setUTCDate(from.getUTCDate() - (days - 1))
	return { from, to }
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

function formatDayLabel(date: Date) {
	return new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date)
}

function formatDateLabel(date: Date) {
	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'short'
	}).format(date)
}

function formatRelativeTime(date: Date) {
	const diffMs = date.getTime() - Date.now()
	const diffSec = Math.round(diffMs / 1000)
	const rtf = new Intl.RelativeTimeFormat('ru-RU', { numeric: 'auto' })

	if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second')

	const diffMin = Math.round(diffSec / 60)
	if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute')

	const diffHour = Math.round(diffMin / 60)
	if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour')

	const diffDay = Math.round(diffHour / 24)
	return rtf.format(diffDay, 'day')
}

function detectBrowser(userAgent: string | null, explicit: string | null) {
	if (explicit) return explicit
	if (!userAgent) return 'Unknown'
	const ua = userAgent.toLowerCase()
	if (ua.includes('edg/')) return 'Edge'
	if (ua.includes('chrome/')) return 'Chrome'
	if (ua.includes('firefox/')) return 'Firefox'
	if (ua.includes('safari/') && !ua.includes('chrome/')) return 'Safari'
	if (ua.includes('opr/')) return 'Opera'
	return 'Unknown'
}

function normalizeDevice(
	deviceType: string | null,
	userAgent: string | null
): 'Mobile' | 'Desktop' | 'Tablet' | 'Other' {
	const raw = (deviceType || '').toLowerCase()
	if (raw.includes('mobile')) return 'Mobile'
	if (raw.includes('tablet')) return 'Tablet'
	if (raw.includes('desktop')) return 'Desktop'

	if (!userAgent) return 'Other'
	const ua = userAgent.toLowerCase()
	if (ua.includes('ipad') || ua.includes('tablet')) return 'Tablet'
	if (
		ua.includes('mobi') ||
		ua.includes('android') ||
		ua.includes('iphone')
	) {
		return 'Mobile'
	}
	if (
		ua.includes('macintosh') ||
		ua.includes('windows') ||
		ua.includes('linux')
	) {
		return 'Desktop'
	}
	return 'Other'
}

function extractReferrerHost(value: string | null) {
	if (!value) return 'direct'
	const input = value.trim()
	if (!input) return 'direct'
	try {
		const url = new URL(
			input.startsWith('http') ? input : `https://${input}`
		)
		return url.hostname.replace(/^www\./, '')
	} catch {
		return input.replace(/^www\./, '')
	}
}

function toCountryName(value: string | null) {
	if (!value) return 'Неизвестно'
	return value
}

function toCompactCountryLabel(value: string) {
	return value === 'Неизвестно' ? '-' : value
}

export async function GET(req: Request, context: RouteContext) {
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
		select: { id: true }
	})
	if (!link) {
		return NextResponse.json({ error: 'Link not found' }, { status: 404 })
	}

	const period = parsePeriod(req)
	const { from, to } = getRange(req, period)
	const { from: prevFrom, to: prevTo } = getPreviousRange(from, to)

	const [events, prevEvents, recentEvents] = await Promise.all([
		prisma.linkClickEvent.findMany({
			where: {
				linkId: id,
				clickedAt: { gte: from, lte: to }
			},
			select: {
				clickedAt: true,
				ipHash: true,
				country: true,
				source: true,
				referrer: true,
				userAgent: true,
				deviceType: true,
				browser: true
			},
			orderBy: { clickedAt: 'asc' }
		}),
		prisma.linkClickEvent.findMany({
			where: {
				linkId: id,
				clickedAt: { gte: prevFrom, lte: prevTo }
			},
			select: {
				clickedAt: true,
				ipHash: true,
				country: true,
				source: true,
				referrer: true,
				userAgent: true,
				deviceType: true,
				browser: true
			},
			orderBy: { clickedAt: 'asc' }
		}),
		prisma.linkClickEvent.findMany({
			where: {
				linkId: id,
				clickedAt: { gte: from, lte: to }
			},
			select: {
				clickedAt: true,
				country: true,
				source: true,
				referrer: true,
				userAgent: true,
				deviceType: true,
				browser: true
			},
			orderBy: { clickedAt: 'desc' },
			take: 200
		})
	])

	const totalClicks = events.length
	const qrScans = events.filter(event => event.source === 'qr').length
	const uniqueVisitors = new Set(
		events.map(
			(event, idx) => event.ipHash || event.userAgent || `anon-${idx}`
		)
	).size
	const daysSpan = Math.max(
		1,
		Math.floor((to.getTime() - from.getTime()) / DAY_MS) + 1
	)
	const avgPerDay = Math.round(totalClicks / daysSpan)

	const prevTotalClicks = prevEvents.length
	const prevQrScans = prevEvents.filter(event => event.source === 'qr').length
	const prevUniqueVisitors = new Set(
		prevEvents.map(
			(event, idx) =>
				event.ipHash || event.userAgent || `anon-prev-${idx}`
		)
	).size
	const prevDaysSpan = Math.max(
		1,
		Math.floor((prevTo.getTime() - prevFrom.getTime()) / DAY_MS) + 1
	)
	const prevAvgPerDay = Math.round(prevTotalClicks / prevDaysSpan)

	const countryCounts = new Map<string, number>()
	const referrerCounts = new Map<string, number>()
	const deviceCounts = new Map<
		'Mobile' | 'Desktop' | 'Tablet' | 'Other',
		number
	>()

	for (const event of events) {
		const country = toCountryName(event.country)
		countryCounts.set(country, (countryCounts.get(country) || 0) + 1)

		const referrer = extractReferrerHost(event.referrer)
		referrerCounts.set(referrer, (referrerCounts.get(referrer) || 0) + 1)

		const device = normalizeDevice(event.deviceType, event.userAgent)
		deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1)
	}

	const topCountries = [...countryCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, clicks]) => ({
			code: name.length === 2 ? name.toUpperCase() : '--',
			name,
			clicks,
			percentage: totalClicks
				? Math.round((clicks / totalClicks) * 100)
				: 0
		}))

	const topReferrers = [...referrerCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, clicks]) => ({ name, clicks }))

	const deviceColors = {
		Mobile: '#4f46e5',
		Desktop: '#a5b4fc',
		Tablet: '#c7d2fe',
		Other: '#e5e7eb'
	}
	const deviceStats = [...deviceCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([type, clicks]) => ({
			type,
			percentage: totalClicks
				? Math.round((clicks / totalClicks) * 100)
				: 0,
			color: deviceColors[type]
		}))

	const bucket = new Map<
		string,
		{ date: Date; value: number; unique: Set<string> }
	>()
	for (let i = 0; i < daysSpan; i += 1) {
		const date = new Date(from.getTime() + i * DAY_MS)
		const key = date.toISOString().slice(0, 10)
		bucket.set(key, { date, value: 0, unique: new Set() })
	}
	for (const event of events) {
		const key = event.clickedAt.toISOString().slice(0, 10)
		const row = bucket.get(key)
		if (!row) continue
		row.value += 1
		row.unique.add(
			event.ipHash || event.userAgent || event.clickedAt.toISOString()
		)
	}

	const chartData = [...bucket.values()].map(row => ({
		day: formatDayLabel(row.date),
		date: formatDateLabel(row.date),
		value: row.value,
		unique: row.unique.size
	}))

	const topCountryLabel = topCountries[0]
		? `${toCompactCountryLabel(topCountries[0].name)} (${topCountries[0].percentage}%)`
		: '—'
	const topCountryClicks = topCountries[0]?.clicks ?? 0
	const prevCountryCounts = new Map<string, number>()
	for (const event of prevEvents) {
		const country = toCountryName(event.country)
		prevCountryCounts.set(
			country,
			(prevCountryCounts.get(country) || 0) + 1
		)
	}
	const prevTopCountryClicks =
		[...prevCountryCounts.values()].sort((a, b) => b - a)[0] ?? 0

	const statsCards = [
		{
			id: 'clicks',
			value: totalClicks.toLocaleString('ru-RU'),
			change: calcChange(totalClicks, prevTotalClicks)
		},
		{
			id: 'visitors',
			value: uniqueVisitors.toLocaleString('ru-RU'),
			change: calcChange(uniqueVisitors, prevUniqueVisitors)
		},
		{
			id: 'avgPerDay',
			value: avgPerDay.toLocaleString('ru-RU'),
			change: calcChange(avgPerDay, prevAvgPerDay)
		},
		{
			id: 'topCountry',
			value: topCountryLabel,
			change: calcChange(topCountryClicks, prevTopCountryClicks)
		},
		{
			id: 'qrScans',
			value: qrScans.toLocaleString('ru-RU'),
			change: calcChange(qrScans, prevQrScans)
		}
	]

	const rawEvents = recentEvents.map(event => ({
		time: formatRelativeTime(event.clickedAt),
		country: {
			code:
				event.country?.length === 2
					? event.country.toUpperCase()
					: '--',
			name: toCountryName(event.country)
		},
		device: {
			type: normalizeDevice(event.deviceType, event.userAgent),
			name: normalizeDevice(event.deviceType, event.userAgent)
		},
		browser: detectBrowser(event.userAgent, event.browser),
		referrer: extractReferrerHost(event.referrer)
	}))

	return NextResponse.json({
		statsCards,
		chart: {
			points: chartData,
			total: totalClicks.toLocaleString('ru-RU'),
			average: avgPerDay.toLocaleString('ru-RU')
		},
		topCountries,
		deviceStats,
		topReferrers,
		rawEvents
	})
}
