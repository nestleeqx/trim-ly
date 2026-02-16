'use client'

import { getAnalyticsSummary } from '@/app/features/analytics/api/analyticsApi'
import {
	defaultStatsData,
	StatData
} from '@/app/features/analytics/components/StatsCards/stats.config'
import { useDelayedFlag } from '@/app/features/shared/hooks/useDelayedFlag'
import { isAbortError } from '@/app/features/shared/utils/abort'
import { useEffect, useState } from 'react'

type SummaryPeriod = '24h' | '7d' | '30d' | '90d'

export function useAnalyticsSummary(period: SummaryPeriod) {
	const [stats, setStats] = useState<StatData[]>(defaultStatsData)
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
				const data = await getAnalyticsSummary({
					period,
					signal: controller.signal
				})
				if (!active) return
				setStats(data.stats)
				setHasLoadedOnce(true)
			} catch (e) {
				if (!active) return
				if (isAbortError(e)) return
				setError(
					e instanceof Error
						? e.message
						: 'Не удалось загрузить аналитику'
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
	}, [period])

	const isInitialLoading = isLoading && !hasLoadedOnce
	const isRefetchingRaw = isLoading && hasLoadedOnce
	const isRefetching = useDelayedFlag(isRefetchingRaw, 180)

	return {
		stats,
		data: stats,
		error,
		isLoading,
		isInitialLoading,
		isRefetching
	}
}
