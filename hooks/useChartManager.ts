import { chartDataByPeriod, Period, statsByPeriod } from '@/data/mockCharts'
import { useCallback, useState } from 'react'

const useChartManager = (initialPeriod: Period = '7d') => {
	const [activePeriod, setActivePeriod] = useState<Period>(initialPeriod)
	const [isLoading, setIsLoading] = useState(false)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [customDateLabel, setCustomDateLabel] = useState('')

	const chartData = chartDataByPeriod[activePeriod]
	const stats = statsByPeriod[activePeriod]

	const handlePeriodChange = useCallback((period: Period) => {
		if (period === 'custom') {
			setShowDatePicker(true)
			return
		}

		setIsLoading(true)
		setActivePeriod(period)
		setCustomDateLabel('')

		setTimeout(() => {
			setIsLoading(false)
		}, 600)
	}, [])

	const handleApplyCustomRange = useCallback(() => {
		if (!startDate || !endDate) return

		const start = new Date(startDate)
		const end = new Date(endDate)

		const formatDate = (date: Date) => {
			return date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'short'
			})
		}

		setCustomDateLabel(`${formatDate(start)} — ${formatDate(end)}`)
		setIsLoading(true)
		setActivePeriod('custom')
		setShowDatePicker(false)

		setTimeout(() => {
			setIsLoading(false)
		}, 600)
	}, [startDate, endDate])

	const handleCancelDatePicker = useCallback(() => {
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
		handlePeriodChange,
		handleApplyCustomRange,
		handleCancelDatePicker,
		getCustomLabel,
		setStartDate,
		setEndDate
	}
}

export default useChartManager
