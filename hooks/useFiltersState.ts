import {
	FiltersState,
	SortState,
	StatusFilter as StatusFilterType
} from '@/types/filterLinks'
import { useCallback, useState } from 'react'

export type FiltersStateData = Omit<FiltersState, 'viewMode'> & {
	country?: string | null
	device?: string | null
	referrer?: string | null
}

export interface FiltersStateReturn {
	filters: FiltersStateData

	selectedStatuses: StatusFilterType[]
	selectedTags: string[]
	selectedCountry: string | null
	selectedDevice: string | null
	selectedReferrer: string | null
	datePreset: '7d' | '30d' | 'custom' | null
	createdFrom: string | null
	createdTo: string | null
	sort: SortState

	handlers: {
		setSelectedStatuses: (statuses: StatusFilterType[]) => void
		setSelectedTags: (tags: string[]) => void
		setSelectedCountry: (country: string | null) => void
		setSelectedDevice: (device: string | null) => void
		setSelectedReferrer: (referrer: string | null) => void
		setDatePreset: (
			preset: '7d' | '30d' | 'custom' | null,
			range?: { from: string | null; to: string | null }
		) => void
		setSort: (sort: SortState) => void
		clearFilters: () => void
	}

	hasActiveFilters: boolean
}

export const useFiltersState = (): FiltersStateReturn => {
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
	const [createdFrom, setCreatedFrom] = useState<string | null>(null)
	const [createdTo, setCreatedTo] = useState<string | null>(null)
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
	const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
	const [selectedReferrer, setSelectedReferrer] = useState<string | null>(null)

	const hasActiveFilters =
		selectedStatuses.length > 0 ||
		selectedTags.length > 0 ||
		datePreset !== null ||
		!!createdFrom ||
		!!createdTo ||
		!!selectedCountry ||
		!!selectedDevice ||
		!!selectedReferrer

	const handleSetDatePreset = useCallback(
		(
			preset: '7d' | '30d' | 'custom' | null,
			range?: { from: string | null; to: string | null }
		) => {
			setDatePreset(preset)

			if (preset === 'custom') {
				setCreatedFrom(range?.from ?? null)
				setCreatedTo(range?.to ?? null)
				return
			}

			setCreatedFrom(null)
			setCreatedTo(null)
		},
		[]
	)

	const clearFilters = useCallback(() => {
		setSelectedStatuses([])
		setSelectedTags([])
		handleSetDatePreset(null)
		setSelectedCountry(null)
		setSelectedDevice(null)
		setSelectedReferrer(null)
		setSort({ field: 'created_date', order: 'desc' })
	}, [handleSetDatePreset])

	const filters: FiltersStateData = {
		statuses: selectedStatuses,
		tags: selectedTags,
		datePreset,
		createdFrom,
		createdTo,
		country: selectedCountry,
		device: selectedDevice,
		referrer: selectedReferrer,
		sort
	}

	return {
		filters,
		selectedStatuses,
		selectedTags,
		selectedCountry,
		selectedDevice,
		selectedReferrer,
		datePreset,
		createdFrom,
		createdTo,
		sort,

		handlers: {
			setSelectedStatuses,
			setSelectedTags,
			setSelectedCountry,
			setSelectedDevice,
			setSelectedReferrer,
			setDatePreset: handleSetDatePreset,
			setSort,
			clearFilters
		},

		hasActiveFilters
	}
}
