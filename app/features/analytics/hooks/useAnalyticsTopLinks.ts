'use client'

import { getAnalyticsTopLinks } from '@/app/features/analytics/api/analyticsApi'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
import { useDelayedFlag } from '@/app/features/shared/hooks/useDelayedFlag'
import { isAbortError } from '@/app/features/shared/utils/abort'
import { LinkItem } from '@/types/links'
import { useEffect, useState } from 'react'

export function useAnalyticsTopLinks(filters: {
	period: '24h' | '7d' | '30d' | '90d'
	country?: string | null
	device?: string | null
	referrer?: string | null
}) {
	const [links, setLinks] = useState<LinkItem[]>([])
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
				const response = await getAnalyticsTopLinks({
					period: filters.period,
					country: filters.country ?? null,
					device: filters.device ?? null,
					referrer: filters.referrer ?? null,
					signal: controller.signal
				})
				if (!active) return
				setLinks(response.links.map(mapLinkDtoToItem))
				setHasLoadedOnce(true)
			} catch (e) {
				if (!active) return
				if (isAbortError(e)) return
				setError(
					e instanceof Error ? e.message : 'Не удалось загрузить ссылки'
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
	const showRefetchLoader = useDelayedFlag(isRefetchingRaw, 180)

	return {
		links,
		data: links,
		error,
		isLoading,
		isInitialLoading,
		isRefetching: isRefetchingRaw && showRefetchLoader
	}
}
