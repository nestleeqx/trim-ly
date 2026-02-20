'use client'

import { Filter, X } from 'lucide-react'
import CountryFilter from './CountryFilter/CountryFilter'
import DateFilter from './DateFilter/DateFilter'
import DeviceFilter from './DeviceFilter/DeviceFilter'
import ReferrerFilter from './ReferrerFilter/ReferrerFilter'
import StatusFilter from './StatusFilter/StatusFilter'
import TagsFilter from './TagsFilter/TagsFilter'
import styles from './LinksFilters.module.scss'

interface LinksFiltersLeftProps {
	showCountry: boolean
	showDevice: boolean
	showDate: boolean
	showStatus: boolean
	showTags: boolean
	showReferrer: boolean
	availableTags: string[]
	tagsLoading: boolean
	availableCountries?: Array<{ code: string; name: string }>
	availableDevices?: Array<{ type: string; name?: string }>
	availableReferrers?: Array<{ name: string }>
	hasActiveFilters: boolean
	selectedTags: string[]
	selectedStatuses: Array<'active' | 'paused' | 'expired' | 'deleted'>
	selectedCountry: string | null
	selectedDevice: string | null
	selectedReferrer: string | null
	datePreset: '7d' | '30d' | 'custom' | null
	onTagsChange: (tags: string[]) => void
	onStatusChange: (
		statuses: Array<'active' | 'paused' | 'expired' | 'deleted'>
	) => void
	onCountryChange: (country: string | null) => void
	onDeviceChange: (device: string | null) => void
	onReferrerChange: (referrer: string | null) => void
	onDatePresetChange: (
		preset: '7d' | '30d' | 'custom' | null,
		range?: { from: string | null; to: string | null }
	) => void
	onClearFilters: () => void
}

export default function LinksFiltersLeft({
	showCountry,
	showDevice,
	showDate,
	showStatus,
	showTags,
	showReferrer,
	availableTags,
	tagsLoading,
	availableCountries,
	availableDevices,
	availableReferrers,
	hasActiveFilters,
	selectedTags,
	selectedStatuses,
	selectedCountry,
	selectedDevice,
	selectedReferrer,
	datePreset,
	onTagsChange,
	onStatusChange,
	onCountryChange,
	onDeviceChange,
	onReferrerChange,
	onDatePresetChange,
	onClearFilters
}: LinksFiltersLeftProps) {
	return (
		<div className={styles.filtersLeft}>
			<span className={styles.filtersLabel}>
				<Filter size={16} />
				Фильтры
			</span>

			{showTags ? (
				<TagsFilter
					availableTags={availableTags}
					isLoading={tagsLoading}
					selectedTags={selectedTags}
					onTagsChange={onTagsChange}
				/>
			) : null}

			{showStatus ? (
				<StatusFilter
					selectedStatuses={selectedStatuses}
					onStatusChange={onStatusChange}
				/>
			) : null}

			{showCountry ? (
				<CountryFilter
					selectedCountry={selectedCountry}
					onCountryChange={onCountryChange}
					countries={availableCountries}
				/>
			) : null}

			{showDevice ? (
				<DeviceFilter
					selectedDevice={selectedDevice}
					onDeviceChange={onDeviceChange}
					devices={availableDevices}
				/>
			) : null}

			{showReferrer ? (
				<ReferrerFilter
					selectedReferrer={selectedReferrer}
					onReferrerChange={onReferrerChange}
					referrers={availableReferrers}
				/>
			) : null}

			{showDate ? (
				<DateFilter
					datePreset={datePreset}
					onDatePresetChange={onDatePresetChange}
				/>
			) : null}

			{hasActiveFilters ? (
				<button
					type='button'
					className={styles.clearBtn}
					onClick={onClearFilters}
				>
					<X size={14} />
					Сбросить
				</button>
			) : null}
		</div>
	)
}
