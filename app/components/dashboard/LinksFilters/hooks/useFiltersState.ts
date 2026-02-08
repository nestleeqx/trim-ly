import {
	FiltersState,
	SortState,
	StatusFilter as StatusFilterType
} from '@/types/filterLinks'
import { useCallback, useState } from 'react'

/**
 * Type для объекта фильтров без viewMode
 */
export type FiltersStateData = Omit<FiltersState, 'viewMode'> & {
	country?: string | null
	device?: string | null
}

/**
 * Интерфейс возвращаемого значения hook'а
 */
export interface FiltersStateReturn {
	// Состояние фильтров (без viewMode)
	filters: FiltersStateData

	// Отдельные состояния для удобства
	selectedStatuses: StatusFilterType[]
	selectedTags: string[]
	selectedCountry: string | null
	selectedDevice: string | null
	datePreset: '7d' | '30d' | 'custom' | null
	startDate: string
	endDate: string
	customDateLabel: string
	showDatePicker: boolean
	sort: SortState

	// Обработчики
	handlers: {
		setSelectedStatuses: (statuses: StatusFilterType[]) => void
		setSelectedTags: (tags: string[]) => void
		setSelectedCountry: (country: string | null) => void
		setSelectedDevice: (device: string | null) => void
		setDatePreset: (preset: '7d' | '30d' | 'custom' | null) => void
		setStartDate: (date: string) => void
		setEndDate: (date: string) => void
		setCustomDateLabel: (label: string) => void
		setShowDatePicker: (show: boolean) => void
		setSort: (sort: SortState) => void
		clearFilters: () => void
	}

	// UI State
	hasActiveFilters: boolean
}

/**
 * useFiltersState Hook
 * Управляет всем состоянием фильтров для LinksFilters компонента
 * Объединяет логику 11 useState в один организованный hook
 */
export const useFiltersState = (): FiltersStateReturn => {
	// Состояние фильтров
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

	// Вычисляемое значение: активные фильтры
	const hasActiveFilters =
		selectedStatuses.length > 0 ||
		selectedTags.length > 0 ||
		datePreset !== null ||
		!!selectedCountry ||
		!!selectedDevice

	// Очистка всех фильтров
	const clearFilters = useCallback(() => {
		setSelectedStatuses([])
		setSelectedTags([])
		setDatePreset(null)
		setSelectedCountry(null)
		setSelectedDevice(null)
		setStartDate('')
		setEndDate('')
		setCustomDateLabel('')
		setShowDatePicker(false)
		setSort({ field: 'created_date', order: 'desc' })
	}, [])

	// Объект фильтров для передачи в callback
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
		startDate,
		endDate,
		customDateLabel,
		showDatePicker,
		sort,

		handlers: {
			setSelectedStatuses,
			setSelectedTags,
			setSelectedCountry,
			setSelectedDevice,
			setDatePreset,
			setStartDate,
			setEndDate,
			setCustomDateLabel,
			setShowDatePicker,
			setSort,
			clearFilters
		},

		hasActiveFilters
	}
}
