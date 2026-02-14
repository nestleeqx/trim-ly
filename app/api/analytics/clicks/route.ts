import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type Period = '24h' | '7d' | '30d' | '90d' | 'custom'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

function parsePeriod(req: Request): Period {
	const raw = (new URL(req.url).searchParams.get('period') || '24h').trim()
	if (raw === '7d' || raw === '30d' || raw === '90d' || raw === 'custom') {
		return raw
	}
	return '24h'
}

function parseDate(value: string | null) {
	if (!value) return null
	const parsed = new Date(value)
	return Number.isNaN(parsed.getTime()) ? null : parsed
}

function getRange(req: Request, period: Period) {
	const now = new Date()

	if (period === 'custom') {
		const url = new URL(req.url)
		const fromParam = parseDate(url.searchParams.get('from'))
		const toParam = parseDate(url.searchParams.get('to'))
		return {
			from: fromParam ?? new Date(now.getTime() - 6 * DAY_MS),
			to: toParam ?? now
		}
	}

	if (period === '24h') {
		return { from: new Date(now.getTime() - 23 * HOUR_MS), to: now }
	}

	const days = period === '90d' ? 90 : period === '30d' ? 30 : 7
	return { from: new Date(now.getTime() - (days - 1) * DAY_MS), to: now }
}

function startOfHour(date: Date) {
	const result = new Date(date)
	result.setMinutes(0, 0, 0)
	return result
}

function startOfDay(date: Date) {
	const result = new Date(date)
	result.setHours(0, 0, 0, 0)
	return result
}

function formatHourLabel(date: Date) {
	return date.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit'
	})
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

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const period = parsePeriod(req)
	const { from, to } = getRange(req, period)

	if (from.getTime() > to.getTime()) {
		return NextResponse.json(
			{ error: 'Invalid date range' },
			{ status: 400 }
		)
	}

	const events = await prisma.linkClickEvent.findMany({
		where: {
			clickedAt: { gte: from, lte: to },
			link: { userId, deletedAt: null }
		},
		select: {
			clickedAt: true,
			ipHash: true,
			userAgent: true
		},
		orderBy: { clickedAt: 'asc' }
	})

	const isHourly = period === '24h'
	const stepMs = isHourly ? HOUR_MS : DAY_MS
	const bucketStart = isHourly ? startOfHour(from) : startOfDay(from)
	const bucketEnd = isHourly ? startOfHour(to) : startOfDay(to)
	const bucketsCount =
		Math.floor((bucketEnd.getTime() - bucketStart.getTime()) / stepMs) + 1

	const buckets = new Map<
		string,
		{ date: Date; value: number; unique: Set<string> }
	>()

	for (let i = 0; i < bucketsCount; i += 1) {
		const date = new Date(bucketStart.getTime() + i * stepMs)
		const key = isHourly
			? date.toISOString().slice(0, 13)
			: date.toISOString().slice(0, 10)
		buckets.set(key, { date, value: 0, unique: new Set() })
	}

	for (let i = 0; i < events.length; i += 1) {
		const event = events[i]
		const bucketDate = isHourly
			? startOfHour(event.clickedAt)
			: startOfDay(event.clickedAt)
		const key = isHourly
			? bucketDate.toISOString().slice(0, 13)
			: bucketDate.toISOString().slice(0, 10)
		const bucket = buckets.get(key)
		if (!bucket) continue
		bucket.value += 1
		bucket.unique.add(event.ipHash || event.userAgent || `anon-${i}`)
	}

	const points = [...buckets.values()].map(row => ({
		day: isHourly ? formatHourLabel(row.date) : formatDayLabel(row.date),
		date: formatDateLabel(row.date),
		value: row.value,
		unique: row.unique.size
	}))

	const total = points.reduce((sum, item) => sum + item.value, 0)
	const avgBase = Math.max(1, points.length)
	const average = Math.round(total / avgBase)

	return NextResponse.json({
		period,
		chart: {
			points,
			total: total.toLocaleString('ru-RU'),
			average: average.toLocaleString('ru-RU')
		}
	})
}
