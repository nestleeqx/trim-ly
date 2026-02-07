'use client'

import {
	LinksFiltersProps,
	SortState,
	StatusFilter as StatusFilterType
} from '@/types/filterLinks'
import { Filter, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import CountryFilter from './CountryFilter/CountryFilter'
import DateFilter from './DateFilter/DateFilter'
import DeviceFilter from './DeviceFilter/DeviceFilter'
import FiltersRight from './FiltersRight/FiltersRight'
import styles from './LinksFilters.module.scss'
import StatusFilter from './StatusFilter/StatusFilter'
import TagsFilter from './TagsFilter/TagsFilter'

interface EnhancedLinksFiltersProps extends LinksFiltersProps {
	viewMode?: 'list' | 'grid'
	onViewModeChange?: (mode: 'list' | 'grid') => void
	onExport?: () => void
	exportLoading?: boolean
	hideRight?: boolean
	showCountry?: boolean
	showDevice?: boolean
	showDate?: boolean
}

const LinksFilters: React.FC<EnhancedLinksFiltersProps> = ({
	onFiltersChange,
	viewMode = 'list',
	onViewModeChange,
	onExport,
	exportLoading,
	hideRight = false,
	showCountry = false,
	showDevice = false,
	showDate = true
}) => {
	const [sort, setSort] = useState<SortState>({
		field: 'created_date',
		order: 'desc'
	})
	const [selectedStatuses, setSelectedStatuses] = useState<
		StatusFilterType[]
	>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [datePreset, setDatePreset] = useState<
		'7d' | '30d' | 'custom' | null
	>(null)
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
	const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [customDateLabel, setCustomDateLabel] = useState('')
	const [showDatePicker, setShowDatePicker] = useState(false)

	const hasActiveFilters =
		selectedStatuses.length > 0 ||
		selectedTags.length > 0 ||
		datePreset !== null ||
		!!selectedCountry ||
		!!selectedDevice

	const clearFilters = () => {
		setSelectedStatuses([])
		setSelectedTags([])
		setDatePreset(null)
		setSelectedCountry(null)
		setSelectedDevice(null)
		setStartDate('')
		setEndDate('')
		setCustomDateLabel('')
		setSort({ field: 'created_date', order: 'desc' })
		setShowDatePicker(false)
	}

	useEffect(() => {
		onFiltersChange?.({
			statuses: selectedStatuses,
			tags: selectedTags,
			datePreset,
			country: selectedCountry,
			device: selectedDevice,
			sort,
			viewMode
		})
	}, [
		selectedStatuses,
		selectedTags,
		datePreset,
		selectedCountry,
		selectedDevice,
		sort,
		viewMode
	])

	return (
		<div className={styles.container}>
			<div className={styles.filtersLeft}>
				<span className={styles.filtersLabel}>
					<Filter size={16} />
					Фильтры
				</span>

				<TagsFilter
					selectedTags={selectedTags}
					onTagsChange={setSelectedTags}
				/>

				<StatusFilter
					selectedStatuses={selectedStatuses}
					onStatusChange={setSelectedStatuses}
				/>

				{showCountry && (
					<CountryFilter
						selectedCountry={selectedCountry}
						onCountryChange={setSelectedCountry}
					/>
				)}

				{showDevice && (
					<DeviceFilter
						selectedDevice={selectedDevice}
						onDeviceChange={setSelectedDevice}
					/>
				)}

				{showDate && (
					<DateFilter
						datePreset={datePreset}
						onDatePresetChange={setDatePreset}
						startDate={startDate}
						endDate={endDate}
						customDateLabel={customDateLabel}
						onStartDateChange={setStartDate}
						onEndDateChange={setEndDate}
						onCustomDateLabelChange={setCustomDateLabel}
						showDatePicker={showDatePicker}
						onShowDatePickerChange={setShowDatePicker}
					/>
				)}

				{hasActiveFilters && (
					<button
						className={styles.clearBtn}
						onClick={clearFilters}
					>
						<X size={14} />
						Сбросить
					</button>
				)}
			</div>

			{!hideRight && (
				<FiltersRight
					sort={sort}
					onSortChange={setSort}
					viewMode={viewMode}
					onViewModeChange={onViewModeChange}
					onExport={onExport}
					exportLoading={exportLoading}
				/>
			)}
		</div>
	)
}

export default LinksFilters
