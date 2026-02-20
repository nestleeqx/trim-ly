'use client'

import {
	AnalyticsClicksPeriod,
	getAnalyticsClicks
} from '@/app/features/analytics/api/analyticsApi'
import { useDelayedFlag } from '@/app/features/shared/hooks/useDelayedFlag'
import { isAbortError } from '@/app/features/shared/utils/abort'
import { ChartDataPoint } from '@/types/charts'
import { useEffect, useMemo, useState } from 'react'

type ChartState = {
	period: AnalyticsClicksPeriod
	points: ChartDataPoint[]
	total: string
	average: string
}

const EMPTY_CHART: ChartState = {
	period: '24h',
	points: [],
	total: '0',
	average: '0'
}

function toInputDate(date: Date) {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

function formatLabelDate(value: string) {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short'
	})
}

export function useAnalyticsClicks() {
	const [activePeriod, setActivePeriod] = useState<AnalyticsClicksPeriod>('24h')
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [startDate, setStartDate] = useState(() =>
		toInputDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
	)
	const [endDate, setEndDate] = useState(() => toInputDate(new Date()))
	const [customDateLabel, setCustomDateLabel] = useState('')
	const [dateRangeError, setDateRangeError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [chart, setChart] = useState<ChartState>(EMPTY_CHART)

	const query = useMemo(
		() => ({
			period: activePeriod,
			from: activePeriod === 'custom' ? startDate : undefined,
			to: activePeriod === 'custom' ? endDate : undefined
		}),
		[activePeriod, startDate, endDate]
	)

	useEffect(() => {
		const controller = new AbortController()
		let active = true

		const run = async () => {
			setIsLoading(true)
			setError(null)
			try {
				const data = await getAnalyticsClicks({
					period: query.period,
					from: query.from,
					to: query.to,
					signal: controller.signal
				})
				if (!active) return
				setChart({
					period: data.period,
					points: data.chart.points,
					total: data.chart.total,
					average: data.chart.average
				})
				setHasLoadedOnce(true)
			} catch (e) {
				if (!active) return
				if (isAbortError(e)) return

				const message =
					e instanceof Error
						? e.message
						: 'Не удалось загрузить данные графика'

				if (
					activePeriod === 'custom' &&
					(message === 'Invalid date range' ||
						message === 'Некорректный диапазон дат')
				) {
					setDateRangeError(
						'Дата начала не может быть позже даты окончания.'
					)
					setShowDatePicker(true)
					setError(null)
					return
				}

				setError(message)
			} finally {
				if (active) setIsLoading(false)
			}
		}

		void run()

		return () => {
			active = false
			controller.abort()
		}
	}, [query, activePeriod])

	const isInitialLoading = isLoading && !hasLoadedOnce
	const isRefetchingRaw = isLoading && hasLoadedOnce
	const showRefetchLoader = useDelayedFlag(isRefetchingRaw, 180)

	const handlePeriodChange = (period: AnalyticsClicksPeriod) => {
		if (period === 'custom') {
			setDateRangeError(null)
			setShowDatePicker(true)
			return
		}
		setShowDatePicker(false)
		setDateRangeError(null)
		setActivePeriod(period)
		setCustomDateLabel('')
	}

	const handleApplyCustomRange = () => {
		if (!startDate || !endDate) return

		const start = new Date(startDate)
		const end = new Date(endDate)

		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
			setDateRangeError('Выберите корректные даты.')
			return
		}
		if (start.getTime() > end.getTime()) {
			setDateRangeError('Дата начала не может быть позже даты окончания.')
			return
		}

		setDateRangeError(null)
		setCustomDateLabel(`${formatLabelDate(startDate)} — ${formatLabelDate(endDate)}`)
		setActivePeriod('custom')
		setShowDatePicker(false)
	}

	const handleCancelDatePicker = () => {
		setDateRangeError(null)
		setShowDatePicker(false)
	}

	const getCustomLabel = () => (customDateLabel ? customDateLabel : 'Период')

	return {
		activePeriod,
		showDatePicker,
		startDate,
		endDate,
		dateRangeError,
		isLoading,
		isInitialLoading,
		isRefetching: isRefetchingRaw && showRefetchLoader,
		error,
		data: chart,
		chartData: chart.points,
		stats: { total: chart.total, average: chart.average },
		chartPeriod: chart.period,
		handlePeriodChange,
		handleApplyCustomRange,
		handleCancelDatePicker,
		getCustomLabel,
		setStartDate,
		setEndDate,
		setDateRangeError
	}
}
