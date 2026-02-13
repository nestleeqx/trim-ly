import {
	getModalConfig,
	LinkItem,
	LinkStatus,
	ModalAction
} from '@/types/links'

export const getStatusLabel = (status: LinkStatus): string => {
	const labels: Record<LinkStatus, string> = {
		active: 'Активна',
		paused: 'Пауза',
		expired: 'Истекла',
		deleted: 'Удалена'
	}
	return labels[status]
}

export const getSelectedLinkItems = (
	links: LinkItem[],
	selectedIds: string[]
): LinkItem[] => {
	return links.filter(link => selectedIds.includes(link.id))
}

export const calculateBulkCapabilities = (selectedItems: LinkItem[]) => {
	return {
		canPauseBulk:
			selectedItems.length > 0 &&
			selectedItems.every(link => link.status === 'active'),
		canResumeBulk:
			selectedItems.length > 0 &&
			selectedItems.every(link => link.status === 'paused'),
		canRestoreBulk:
			selectedItems.length > 0 &&
			selectedItems.every(link => link.status === 'deleted'),
		canDeleteBulk:
			selectedItems.length > 0 &&
			selectedItems.every(link => link.status !== 'deleted')
	}
}

export interface ResultsInfoData {
	show: boolean
	totalFound: number
	searchQuery: string
}

export const getResultsInfo = (
	filteredCount: number,
	selectedCount: number,
	searchQuery: string
): ResultsInfoData => {
	return {
		show: filteredCount > 0 && selectedCount === 0,
		totalFound: filteredCount,
		searchQuery
	}
}

export interface EmptyStateData {
	show: boolean
	hasLinks: boolean
	hasFilteredLinks: boolean
}

export const getEmptyStateData = (
	totalLinks: number,
	filteredLinks: number
): EmptyStateData => {
	const hasLinks = totalLinks > 0
	const hasFilteredLinks = filteredLinks > 0

	return {
		show: totalLinks === 0 || filteredLinks === 0,
		hasLinks,
		hasFilteredLinks
	}
}

export const getConfirmModalConfig = (
	action: string | null,
	itemCount: number,
	itemTitle?: string
) => {
	const modalAction = (action || 'delete-single') as ModalAction
	return getModalConfig(modalAction, itemCount, itemTitle)
}
