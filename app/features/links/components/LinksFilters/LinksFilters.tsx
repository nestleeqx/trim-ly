'use client'

import { useMemo } from 'react'
import { useFiltersState } from '@/app/features/links/hooks/useFiltersState'
import FiltersRight from './FiltersRight/FiltersRight'
import LinksFiltersLeft from './LinksFiltersLeft'
import useEmitLinksFiltersChange from './hooks/useEmitLinksFiltersChange'
import styles from './LinksFilters.module.scss'
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

	const filtersPayload = useMemo(
		() => ({
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
		}),
		[
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
		]
	)

	useEmitLinksFiltersChange(onFiltersChange, filtersPayload)

	return (
		<div className={styles.container}>
			<LinksFiltersLeft
				showCountry={showCountry}
				showDevice={showDevice}
				showDate={showDate}
				showStatus={showStatus}
				showTags={showTags}
				showReferrer={showReferrer}
				availableTags={availableTags}
				tagsLoading={tagsLoading}
				availableCountries={availableCountries}
				availableDevices={availableDevices}
				availableReferrers={availableReferrers}
				hasActiveFilters={hasActiveFilters}
				selectedTags={filtersState.selectedTags}
				selectedStatuses={filtersState.selectedStatuses}
				selectedCountry={filtersState.selectedCountry}
				selectedDevice={filtersState.selectedDevice}
				selectedReferrer={filtersState.selectedReferrer}
				datePreset={filtersState.datePreset}
				onTagsChange={handlers.setSelectedTags}
				onStatusChange={handlers.setSelectedStatuses}
				onCountryChange={handlers.setSelectedCountry}
				onDeviceChange={handlers.setSelectedDevice}
				onReferrerChange={handlers.setSelectedReferrer}
				onDatePresetChange={handlers.setDatePreset}
				onClearFilters={handlers.clearFilters}
			/>

			{!hideRight ? (
				<FiltersRight
					sort={filtersState.sort}
					onSortChange={handlers.setSort}
					viewMode={viewMode}
					onViewModeChange={mode => onViewModeChange?.(mode)}
					onExport={onExport}
					exportLoading={exportLoading}
				/>
			) : null}
		</div>
	)
}
