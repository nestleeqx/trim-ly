import { authOptions } from '@/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

type AnalyticsPeriod = '24h' | '7d' | '30d' | '90d'

const HOUR_MS = 60 * 60 * 1000
const DAY_MS = 24 * HOUR_MS

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

function toCountryName(value: string | null) {
	return value || 'Неизвестно'
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

export async function GET(req: Request) {
	const session = await getServerSession(authOptions)
	const userId = session?.user?.id
	if (!userId) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const url = new URL(req.url)
	const period = parsePeriod(req)
	const selectedCountry =
		(url.searchParams.get('country') || '').trim() || null
	const selectedDevice = (url.searchParams.get('device') || '').trim() || null
	const selectedReferrer =
		(url.searchParams.get('referrer') || '').trim() || null
	const { from, to } = getRange(period)

	const allEvents = await prisma.linkClickEvent.findMany({
		where: {
			clickedAt: { gte: from, lte: to },
			link: { userId, deletedAt: null }
		},
		select: {
			country: true,
			referrer: true,
			userAgent: true,
			deviceType: true
		}
	})

	const availableCountriesSet = new Map<string, string>()
	const availableDevicesSet = new Set<string>()
	const availableReferrersCounts = new Map<string, number>()

	for (const event of allEvents) {
		const countryName = toCountryName(event.country)
		const countryCode =
			event.country && event.country.length === 2
				? event.country.toUpperCase()
				: '--'
		availableCountriesSet.set(countryCode, countryName)
		availableDevicesSet.add(
			normalizeDevice(event.deviceType, event.userAgent)
		)
		const referrer = extractReferrerHost(event.referrer)
		availableReferrersCounts.set(
			referrer,
			(availableReferrersCounts.get(referrer) || 0) + 1
		)
	}

	const filteredEvents = allEvents.filter(event => {
		const countryCode =
			event.country && event.country.length === 2
				? event.country.toUpperCase()
				: '--'
		const device = normalizeDevice(event.deviceType, event.userAgent)
		const referrer = extractReferrerHost(event.referrer)
		const byCountry = selectedCountry
			? countryCode === selectedCountry
			: true
		const byDevice = selectedDevice ? device === selectedDevice : true
		const byReferrer = selectedReferrer
			? referrer === selectedReferrer
			: true
		return byCountry && byDevice && byReferrer
	})

	const totalClicks = filteredEvents.length
	const countryCounts = new Map<string, number>()
	const referrerCounts = new Map<string, number>()
	const deviceCounts = new Map<string, number>()

	for (const event of filteredEvents) {
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

	const deviceColors: Record<string, string> = {
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
			color: deviceColors[type] || '#e5e7eb'
		}))

	const topReferrers = [...referrerCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, clicks]) => ({ name, clicks }))

	const availableCountries = [...availableCountriesSet.entries()]
		.map(([code, name]) => ({ code, name }))
		.sort((a, b) => a.name.localeCompare(b.name, 'ru'))

	const availableDevices = [...availableDevicesSet]
		.sort((a, b) => a.localeCompare(b, 'en'))
		.map(type => ({ type }))
	const availableReferrers = [...availableReferrersCounts.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([name]) => ({ name }))

	return NextResponse.json({
		period,
		topCountries,
		deviceStats,
		topReferrers,
		availableCountries,
		availableDevices,
		availableReferrers
	})
}
