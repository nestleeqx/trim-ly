import { LinksFiltersProps } from '@/types/filterLinks'

export interface EnhancedLinksFiltersProps extends LinksFiltersProps {
	viewMode?: 'list' | 'grid'
	onViewModeChange?: (mode: 'list' | 'grid') => void
	onExport?: () => void
	exportLoading?: boolean
	hideRight?: boolean
	showCountry?: boolean
	showDevice?: boolean
	showDate?: boolean
}
