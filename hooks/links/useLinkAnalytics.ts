'use client'

import {
	getLinkAnalytics,
	LinkAnalyticsResponse
} from '@/app/features/links/api/linksApi'
import { useEffect, useState } from 'react'

export type LinkAnalyticsPeriod = '7d' | '30d' | '90d' | 'custom'

interface UseLinkAnalyticsOptions {
	period?: LinkAnalyticsPeriod
	from?: string
	to?: string
}

const EMPTY_ANALYTICS: LinkAnalyticsResponse = {
	statsCards: [
		{ id: 'clicks', value: '0', change: 0 },
		{ id: 'visitors', value: '0', change: 0 },
		{ id: 'avgPerDay', value: '0', change: 0 },
		{ id: 'topCountry', value: '-', change: 0 }
	],
	chart: {
		points: [],
		total: '0',
		average: '0'
	},
	topCountries: [],
	deviceStats: [],
	topReferrers: [],
	rawEvents: []
}

export function useLinkAnalytics(
	linkId: string,
	options?: UseLinkAnalyticsOptions
) {
	const [data, setData] = useState<LinkAnalyticsResponse>(EMPTY_ANALYTICS)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!linkId) return

		const controller = new AbortController()
		let active = true

		const run = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const response = await getLinkAnalytics(linkId, {
					period: options?.period || '30d',
					from: options?.from,
					to: options?.to,
					signal: controller.signal
				})
				if (!active) return
				setData(response)
			} catch (e) {
				if (!active) return
				if (e instanceof DOMException && e.name === 'AbortError') return
				setError(
					e instanceof Error ? e.message : 'Failed to load analytics'
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
	}, [linkId, options?.period, options?.from, options?.to])

	return {
		data,
		isLoading,
		error
	}
}
