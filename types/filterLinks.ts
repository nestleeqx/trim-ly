export type ViewMode = 'list' | 'grid'
export type StatusFilter = 'active' | 'paused' | 'expired' | 'deleted'
export type DatePreset = '7d' | '30d' | 'custom'
export type SortField =
	| 'created_date'
	| 'clicks'
	| 'title'
	| 'status'
	| 'expiration_date'
export type SortOrder = 'asc' | 'desc'

export interface SortState {
	field: SortField
	order: SortOrder
}

export interface FiltersState {
	statuses: StatusFilter[]
	tags: string[]
	datePreset: DatePreset | null
	sort: SortState
	viewMode: ViewMode
}

export interface LinksFiltersProps {
	onFiltersChange?: (filters: FiltersState) => void
}
