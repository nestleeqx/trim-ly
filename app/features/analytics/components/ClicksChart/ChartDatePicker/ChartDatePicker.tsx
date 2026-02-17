'use client'

import DateRangePicker from '@/app/features/links/components/LinksFilters/DateFilter/DateRangePicker/DateRangePicker'

interface ChartDatePickerProps {
	show: boolean
	startDate: string
	endDate: string
	error?: string | null
	onStartDateChange: (date: string) => void
	onEndDateChange: (date: string) => void
	onApply: () => void
	onCancel: () => void
}

export default function ChartDatePicker({
	show,
	startDate,
	endDate,
	error,
	onStartDateChange,
	onEndDateChange,
	onApply,
	onCancel
}: ChartDatePickerProps) {
	if (!show) return null

	return (
		<DateRangePicker
			startDate={startDate}
			endDate={endDate}
			error={error}
			onStartDateChange={onStartDateChange}
			onEndDateChange={onEndDateChange}
			onApply={() => onApply()}
			onCancel={onCancel}
		/>
	)
}
