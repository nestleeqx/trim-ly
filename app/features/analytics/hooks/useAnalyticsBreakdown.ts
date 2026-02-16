'use client'

import { getAnalyticsBreakdown } from '@/app/features/analytics/api/analyticsApi'
import { useDelayedFlag } from '@/app/features/shared/hooks/useDelayedFlag'
import { isAbortError } from '@/app/features/shared/utils/abort'
import { DeviceStats, TopCountry, TopReferrer } from '@/types/charts'
import { useEffect, useState } from 'react'

const EMPTY_BREAKDOWN = {
	topCountries: [] as TopCountry[],
	deviceStats: [] as DeviceStats[],
	topReferrers: [] as TopReferrer[],
	availableCountries: [] as Array<{ code: string; name: string }>,
	availableDevices: [] as Array<{ type: string }>,
	availableReferrers: [] as Array<{ name: string }>
}

export function useAnalyticsBreakdown(filters: {
	period: '24h' | '7d' | '30d' | '90d'
	country?: string | null
	device?: string | null
	referrer?: string | null
}) {
	const [data, setData] = useState(EMPTY_BREAKDOWN)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

	useEffect(() => {
		const controller = new AbortController()
		let active = true

		const run = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await getAnalyticsBreakdown({
					period: filters.period,
					country: filters.country ?? null,
					device: filters.device ?? null,
					referrer: filters.referrer ?? null,
					signal: controller.signal
				})
				if (!active) return
				setData({
					topCountries: response.topCountries,
					deviceStats: response.deviceStats,
					topReferrers: response.topReferrers,
					availableCountries: response.availableCountries,
					availableDevices: response.availableDevices,
					availableReferrers: response.availableReferrers
				})
				setHasLoadedOnce(true)
			} catch (e) {
				if (!active) return
				if (isAbortError(e)) return
				setError(
					e instanceof Error ? e.message : 'Не удалось загрузить данные'
				)
			} finally {
				if (active) setIsLoading(false)
			}
		}

		void run()
		return () => {
			active = false
			controller.abort()
		}
	}, [filters.period, filters.country, filters.device, filters.referrer])

	const isInitialLoading = isLoading && !hasLoadedOnce
	const isRefetchingRaw = isLoading && hasLoadedOnce
	const isRefetching = useDelayedFlag(isRefetchingRaw, 180)

	return {
		...data,
		data,
		error,
		isLoading,
		isInitialLoading,
		isRefetching
	}
}
