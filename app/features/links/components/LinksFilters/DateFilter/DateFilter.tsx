'use client'

import { DatePreset } from '@/types/filterLinks'
import { formatDateRange } from '@/utils/formatters'
import { Calendar } from 'lucide-react'
import { useState } from 'react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'
import DateRangePicker from './DateRangePicker/DateRangePicker'

type DatePresetNullable = DatePreset | null

interface DateFilterProps {
	datePreset: DatePresetNullable
	onDatePresetChange: (
		preset: DatePresetNullable,
		range?: { from: string | null; to: string | null }
	) => void
}

const DATE_PRESETS: { value: DatePresetNullable; label: string }[] = [
	{ value: null, label: 'Все время' },
	{ value: '7d', label: '7 дней' },
	{ value: '30d', label: '30 дней' }
]

export default function DateFilter({
	datePreset,
	onDatePresetChange
}: DateFilterProps) {
	const [showPicker, setShowPicker] = useState(false)
	const [customLabel, setCustomLabel] = useState('')

	const getLabel = () => {
		if (datePreset === 'custom' && customLabel) return customLabel
		return DATE_PRESETS.find(p => p.value === datePreset)?.label ?? 'Период'
	}

	const handlePresetSelect = (preset: DatePresetNullable) => {
		if (preset === 'custom') {
			setShowPicker(true)
			return
		}
		onDatePresetChange(preset)
	}

	const handleApplyRange = (startDate: string, endDate: string) => {
		setCustomLabel(formatDateRange(startDate, endDate))
		onDatePresetChange('custom', { from: startDate, to: endDate })
		setShowPicker(false)
	}

	return (
		<>
			<FilterDropdown
				label={getLabel()}
				icon={<Calendar size={14} />}
				hasSelection={datePreset !== null}
				onClose={() => {
					if (!showPicker) setShowPicker(false)
				}}
			>
				{DATE_PRESETS.map(({ value, label }) => (
					<button
						type='button'
						key={String(value)}
						className={`${commonStyles.dropdownItem} ${datePreset === value ? commonStyles.selected : ''}`}
						onClick={() => handlePresetSelect(value)}
					>
						{label}
					</button>
				))}
				<div className={commonStyles.divider} />
				<button
					type='button'
					className={`${commonStyles.dropdownItem} ${datePreset === 'custom' ? commonStyles.selected : ''}`}
					onClick={() => handlePresetSelect('custom')}
				>
					<Calendar size={14} />
					Выбрать период...
				</button>
			</FilterDropdown>

			{showPicker && (
				<DateRangePicker
					onApply={handleApplyRange}
					onCancel={() => setShowPicker(false)}
				/>
			)}
		</>
	)
}
