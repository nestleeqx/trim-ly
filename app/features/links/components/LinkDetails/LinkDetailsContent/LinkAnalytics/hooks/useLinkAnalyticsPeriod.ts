'use client'

import {
	LinkAnalyticsPeriod
} from '@/app/features/links/hooks/useLinkAnalytics'
import { useMemo, useState } from 'react'

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

export default function useLinkAnalyticsPeriod() {
	const [activePeriod, setActivePeriod] = useState<LinkAnalyticsPeriod>('30d')
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [startDate, setStartDate] = useState(() =>
		toInputDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
	)
	const [endDate, setEndDate] = useState(() => toInputDate(new Date()))
	const [customDateLabel, setCustomDateLabel] = useState('')
	const [dateRangeError, setDateRangeError] = useState<string | null>(null)

	const query = useMemo(
		() => ({
			period: activePeriod,
			from: activePeriod === 'custom' ? startDate : undefined,
			to: activePeriod === 'custom' ? endDate : undefined
		}),
		[activePeriod, startDate, endDate]
	)

	const onPeriodChange = (period: LinkAnalyticsPeriod) => {
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

	const onApplyCustomRange = () => {
		if (!startDate || !endDate) return
		if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
			setDateRangeError('Дата начала не может быть позже даты окончания.')
			return
		}

		setDateRangeError(null)
		setCustomDateLabel(
			`${formatLabelDate(startDate)} — ${formatLabelDate(endDate)}`
		)
		setActivePeriod('custom')
		setShowDatePicker(false)
	}

	return {
		query,
		activePeriod,
		showDatePicker,
		startDate,
		endDate,
		dateRangeError,
		getCustomLabel: () => customDateLabel || 'Период',
		onPeriodChange,
		onApplyCustomRange,
		onCancelDatePicker: () => {
			setDateRangeError(null)
			setShowDatePicker(false)
		},
		onStartDateChange: (value: string) => {
			setDateRangeError(null)
			setStartDate(value)
		},
		onEndDateChange: (value: string) => {
			setDateRangeError(null)
			setEndDate(value)
		}
	}
}
