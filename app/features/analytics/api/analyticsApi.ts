import { StatData } from '@/app/features/analytics/components/StatsCards/stats.config'
import { LinkListItemDto } from '@/app/features/links/api/linksApi'
import {
	ChartDataPoint,
	DeviceStats,
	TopCountry,
	TopReferrer
} from '@/types/charts'

type AnalyticsSummaryResponse = {
	period: Exclude<AnalyticsClicksPeriod, 'custom'>
	stats: StatData[]
}

export type AnalyticsClicksPeriod = '24h' | '7d' | '30d' | '90d' | 'custom'

type AnalyticsClicksResponse = {
	period: AnalyticsClicksPeriod
	chart: {
		points: ChartDataPoint[]
		total: string
		average: string
	}
}

type AnalyticsBreakdownResponse = {
	period: Exclude<AnalyticsClicksPeriod, 'custom'>
	topCountries: TopCountry[]
	deviceStats: DeviceStats[]
	topReferrers: TopReferrer[]
	availableCountries: Array<{ code: string; name: string }>
	availableDevices: Array<{ type: string }>
	availableReferrers: Array<{ name: string }>
}

type AnalyticsTopLinksResponse = {
	period: Exclude<AnalyticsClicksPeriod, 'custom'>
	links: LinkListItemDto[]
}

type ErrorResponse = {
	error?: string
}

function parseErrorMessage(data: unknown, fallback: string): string {
	if (
		typeof data === 'object' &&
		data !== null &&
		'error' in data &&
		typeof (data as { error: unknown }).error === 'string'
	) {
		return (data as ErrorResponse).error || fallback
	}

	return fallback
}

export async function getAnalyticsSummary(params?: {
	period?: Exclude<AnalyticsClicksPeriod, 'custom'>
	signal?: AbortSignal
}) {
	const search = new URLSearchParams()
	if (params?.period) search.set('period', params.period)
	const qs = search.toString()
	const url = qs ? `/api/analytics/summary?${qs}` : '/api/analytics/summary'

	const res = await fetch(url, {
		method: 'GET',
		cache: 'no-store',
		signal: params?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(parseErrorMessage(data, 'Failed to load analytics'))
	}

	return data as AnalyticsSummaryResponse
}

export async function getAnalyticsClicks(params?: {
	period?: AnalyticsClicksPeriod
	from?: string
	to?: string
	signal?: AbortSignal
}): Promise<AnalyticsClicksResponse> {
	const search = new URLSearchParams()
	if (params?.period) search.set('period', params.period)
	if (params?.from) search.set('from', params.from)
	if (params?.to) search.set('to', params.to)
	const qs = search.toString()
	const url = qs ? `/api/analytics/clicks?${qs}` : '/api/analytics/clicks'

	const res = await fetch(url, {
		method: 'GET',
		cache: 'no-store',
		signal: params?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(parseErrorMessage(data, 'Failed to load chart'))
	}

	return data as AnalyticsClicksResponse
}

export async function getAnalyticsBreakdown(params?: {
	period?: Exclude<AnalyticsClicksPeriod, 'custom'>
	country?: string | null
	device?: string | null
	referrer?: string | null
	signal?: AbortSignal
}): Promise<AnalyticsBreakdownResponse> {
	const search = new URLSearchParams()
	if (params?.period) search.set('period', params.period)
	if (params?.country) search.set('country', params.country)
	if (params?.device) search.set('device', params.device)
	if (params?.referrer) search.set('referrer', params.referrer)
	const qs = search.toString()
	const url = qs
		? `/api/analytics/breakdown?${qs}`
		: '/api/analytics/breakdown'

	const res = await fetch(url, {
		method: 'GET',
		cache: 'no-store',
		signal: params?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(parseErrorMessage(data, 'Failed to load breakdown'))
	}

	return data as AnalyticsBreakdownResponse
}

export async function getAnalyticsTopLinks(params?: {
	period?: Exclude<AnalyticsClicksPeriod, 'custom'>
	country?: string | null
	device?: string | null
	referrer?: string | null
	signal?: AbortSignal
}): Promise<AnalyticsTopLinksResponse> {
	const search = new URLSearchParams()
	if (params?.period) search.set('period', params.period)
	if (params?.country) search.set('country', params.country)
	if (params?.device) search.set('device', params.device)
	if (params?.referrer) search.set('referrer', params.referrer)
	const qs = search.toString()
	const url = qs
		? `/api/analytics/top-links?${qs}`
		: '/api/analytics/top-links'

	const res = await fetch(url, {
		method: 'GET',
		cache: 'no-store',
		signal: params?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(parseErrorMessage(data, 'Failed to load top links'))
	}

	return data as AnalyticsTopLinksResponse
}
