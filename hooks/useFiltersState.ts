import {
	FiltersState,
	SortState,
	StatusFilter as StatusFilterType
} from '@/types/filterLinks'
import { useCallback, useState } from 'react'

export type FiltersStateData = Omit<FiltersState, 'viewMode'> & {
	country?: string | null
	device?: string | null
}

export interface FiltersStateReturn {
	filters: FiltersStateData

	selectedStatuses: StatusFilterType[]
	selectedTags: string[]
	selectedCountry: string | null
	selectedDevice: string | null
	datePreset: '7d' | '30d' | 'custom' | null
	sort: SortState

	handlers: {
		setSelectedStatuses: (statuses: StatusFilterType[]) => void
		setSelectedTags: (tags: string[]) => void
		setSelectedCountry: (country: string | null) => void
		setSelectedDevice: (device: string | null) => void
		setDatePreset: (preset: '7d' | '30d' | 'custom' | null) => void
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
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
	const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

	const hasActiveFilters =
		selectedStatuses.length > 0 ||
		selectedTags.length > 0 ||
		datePreset !== null ||
		!!selectedCountry ||
		!!selectedDevice

	const clearFilters = useCallback(() => {
		setSelectedStatuses([])
		setSelectedTags([])
		setDatePreset(null)
		setSelectedCountry(null)
		setSelectedDevice(null)
		setSort({ field: 'created_date', order: 'desc' })
	}, [])

	const filters: FiltersStateData = {
		statuses: selectedStatuses,
		tags: selectedTags,
		datePreset,
		country: selectedCountry,
		device: selectedDevice,
		sort
	}

	return {
		filters,
		selectedStatuses,
		selectedTags,
		selectedCountry,
		selectedDevice,
		datePreset,
		sort,

		handlers: {
			setSelectedStatuses,
			setSelectedTags,
			setSelectedCountry,
			setSelectedDevice,
			setDatePreset,
			setSort,
			clearFilters
		},

		hasActiveFilters
	}
}
