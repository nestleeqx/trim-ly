'use client'

import { LinksFiltersProps } from '@/types/filterLinks'
import { Filter, X } from 'lucide-react'
import FiltersRight from '../../ui/FiltersRight/FiltersRight'
import CountryFilter from './CountryFilter/CountryFilter'
import DateFilter from './DateFilter/DateFilter'
import DeviceFilter from './DeviceFilter/DeviceFilter'
import { useFiltersState } from './hooks/useFiltersState'
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
	const filtersState = useFiltersState()
	const { handlers, hasActiveFilters } = filtersState

	// Синхронизировать фильтры при изменении
	// useEffect(() => {
	// 	onFiltersChange?.({
	// 		statuses: filtersState.selectedStatuses,
	// 		tags: filtersState.selectedTags,
	// 		datePreset: filtersState.datePreset,
	// 		country: filtersState.selectedCountry,
	// 		device: filtersState.selectedDevice,
	// 		sort: filtersState.sort,
	// 		viewMode
	// 	})
	// }, [
	// 	filtersState.selectedStatuses,
	// 	filtersState.selectedTags,
	// 	filtersState.datePreset,
	// 	filtersState.selectedCountry,
	// 	filtersState.selectedDevice,
	// 	filtersState.sort,
	// 	viewMode,
	// 	onFiltersChange
	// ])

	const handleViewModeChange = (mode: 'list' | 'grid') => {
		onViewModeChange?.(mode)
	}

	return (
		<div className={styles.container}>
			<div className={styles.filtersLeft}>
				<span className={styles.filtersLabel}>
					<Filter size={16} />
					Фильтры
				</span>

				<TagsFilter
					selectedTags={filtersState.selectedTags}
					onTagsChange={handlers.setSelectedTags}
				/>

				<StatusFilter
					selectedStatuses={filtersState.selectedStatuses}
					onStatusChange={handlers.setSelectedStatuses}
				/>

				{showCountry && (
					<CountryFilter
						selectedCountry={filtersState.selectedCountry}
						onCountryChange={handlers.setSelectedCountry}
					/>
				)}

				{showDevice && (
					<DeviceFilter
						selectedDevice={filtersState.selectedDevice}
						onDeviceChange={handlers.setSelectedDevice}
					/>
				)}

				{showDate && (
					<DateFilter
						datePreset={filtersState.datePreset}
						onDatePresetChange={handlers.setDatePreset}
						startDate={filtersState.startDate}
						endDate={filtersState.endDate}
						customDateLabel={filtersState.customDateLabel}
						onStartDateChange={handlers.setStartDate}
						onEndDateChange={handlers.setEndDate}
						onCustomDateLabelChange={handlers.setCustomDateLabel}
						showDatePicker={filtersState.showDatePicker}
						onShowDatePickerChange={handlers.setShowDatePicker}
					/>
				)}

				{hasActiveFilters && (
					<button
						className={styles.clearBtn}
						onClick={handlers.clearFilters}
					>
						<X size={14} />
						Сбросить
					</button>
				)}
			</div>

			{!hideRight && (
				<FiltersRight
					sort={filtersState.sort}
					onSortChange={handlers.setSort}
					viewMode={viewMode}
					onViewModeChange={handleViewModeChange}
					onExport={onExport}
					exportLoading={exportLoading}
				/>
			)}
		</div>
	)
}

export default LinksFilters
