'use client'

import { getAnalyticsTopLinks } from '@/app/features/analytics/api/analyticsApi'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
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
	const [showRefetchLoader, setShowRefetchLoader] = useState(false)

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
				if (e instanceof DOMException && e.name === 'AbortError') return
				setError(e instanceof Error ? e.message : 'Не удалось загрузить ссылки')
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

	useEffect(() => {
		if (!isRefetchingRaw) {
			setShowRefetchLoader(false)
			return
		}

		const timer = setTimeout(() => {
			setShowRefetchLoader(true)
		}, 180)

		return () => clearTimeout(timer)
	}, [isRefetchingRaw])

	return {
		links,
		error,
		isLoading,
		isInitialLoading,
		isRefetching: isRefetchingRaw && showRefetchLoader
	}
}
