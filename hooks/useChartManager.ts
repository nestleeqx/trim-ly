import { chartDataByPeriod, Period, statsByPeriod } from '@/data/mockCharts'
import { useCallback, useState } from 'react'

const useChartManager = (initialPeriod: Period = '7d') => {
	const [activePeriod, setActivePeriod] = useState<Period>(initialPeriod)
	const [isLoading, setIsLoading] = useState(false)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [customDateLabel, setCustomDateLabel] = useState('')
	const [dateRangeError, setDateRangeError] = useState<string | null>(null)

	const chartData = chartDataByPeriod[activePeriod]
	const stats = statsByPeriod[activePeriod]

	const handlePeriodChange = useCallback((period: Period) => {
		if (period === 'custom') {
			setDateRangeError(null)
			setShowDatePicker(true)
			return
		}

		setIsLoading(true)
		setActivePeriod(period)
		setCustomDateLabel('')
		setDateRangeError(null)
		setShowDatePicker(false)

		setTimeout(() => {
			setIsLoading(false)
		}, 600)
	}, [])

	const handleApplyCustomRange = useCallback(() => {
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

		const formatDate = (date: Date) =>
			date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'short'
			})

		setDateRangeError(null)
		setCustomDateLabel(`${formatDate(start)} — ${formatDate(end)}`)
		setIsLoading(true)
		setActivePeriod('custom')
		setShowDatePicker(false)

		setTimeout(() => {
			setIsLoading(false)
		}, 600)
	}, [startDate, endDate])

	const handleCancelDatePicker = useCallback(() => {
		setDateRangeError(null)
		setShowDatePicker(false)
	}, [])

	const getCustomLabel = () => {
		if (customDateLabel) return customDateLabel
		return 'Период'
	}

	return {
		activePeriod,
		isLoading,
		chartData,
		stats,
		showDatePicker,
		startDate,
		endDate,
		dateRangeError,
		handlePeriodChange,
		handleApplyCustomRange,
		handleCancelDatePicker,
		getCustomLabel,
		setStartDate,
		setEndDate,
		setDateRangeError
	}
}

export default useChartManager
