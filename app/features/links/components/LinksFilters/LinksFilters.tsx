'use client'

import { Filter, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useFiltersState } from '../../../../../hooks/useFiltersState'
import CountryFilter from './CountryFilter/CountryFilter'
import DateFilter from './DateFilter/DateFilter'
import DeviceFilter from './DeviceFilter/DeviceFilter'
import FiltersRight from './FiltersRight/FiltersRight'
import ReferrerFilter from './ReferrerFilter/ReferrerFilter'
import styles from './LinksFilters.module.scss'
import StatusFilter from './StatusFilter/StatusFilter'
import TagsFilter from './TagsFilter/TagsFilter'
import { EnhancedLinksFiltersProps } from './types'

export default function LinksFilters({
	onFiltersChange,
	viewMode = 'list',
	onViewModeChange,
	onExport,
	exportLoading,
	availableTags = [],
	tagsLoading = false,
	hideRight = false,
	showCountry = false,
	showDevice = false,
	showDate = true,
	showStatus = true,
	showTags = true,
	showReferrer = false,
	availableCountries,
	availableDevices,
	availableReferrers
}: EnhancedLinksFiltersProps) {
	const filtersState = useFiltersState()
	const { handlers, hasActiveFilters } = filtersState

	const onFiltersChangeRef = useRef(onFiltersChange)
	useEffect(() => {
		onFiltersChangeRef.current = onFiltersChange
	}, [onFiltersChange])

	useEffect(() => {
		onFiltersChangeRef.current?.({
			statuses: filtersState.selectedStatuses,
			tags: filtersState.selectedTags,
			datePreset: filtersState.datePreset,
			createdFrom: filtersState.createdFrom,
			createdTo: filtersState.createdTo,
			country: filtersState.selectedCountry,
			device: filtersState.selectedDevice,
			referrer: filtersState.selectedReferrer,
			sort: filtersState.sort,
			viewMode
		})
	}, [
		filtersState.selectedStatuses,
		filtersState.selectedTags,
		filtersState.datePreset,
		filtersState.createdFrom,
		filtersState.createdTo,
		filtersState.selectedCountry,
		filtersState.selectedDevice,
		filtersState.selectedReferrer,
		filtersState.sort,
		viewMode
	])

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

				{showTags && (
					<TagsFilter
						availableTags={availableTags}
						isLoading={tagsLoading}
						selectedTags={filtersState.selectedTags}
						onTagsChange={handlers.setSelectedTags}
					/>
				)}

				{showStatus && (
					<StatusFilter
						selectedStatuses={filtersState.selectedStatuses}
						onStatusChange={handlers.setSelectedStatuses}
					/>
				)}

				{showCountry && (
					<CountryFilter
						selectedCountry={filtersState.selectedCountry}
						onCountryChange={handlers.setSelectedCountry}
						countries={availableCountries}
					/>
				)}

				{showDevice && (
					<DeviceFilter
						selectedDevice={filtersState.selectedDevice}
						onDeviceChange={handlers.setSelectedDevice}
						devices={availableDevices}
					/>
				)}

				{showReferrer && (
					<ReferrerFilter
						selectedReferrer={filtersState.selectedReferrer}
						onReferrerChange={handlers.setSelectedReferrer}
						referrers={availableReferrers}
					/>
				)}

				{showDate && (
					<DateFilter
						datePreset={filtersState.datePreset}
						onDatePresetChange={handlers.setDatePreset}
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
