import { LinkItem as LinkItemType } from '@/types/links'

export interface LinkTableRowProps {
	link: LinkItemType
	isSelected?: boolean
	onSelectLink?: (id: string, checked: boolean) => void
	allowSelection?: boolean
	showActions?: boolean
	showTrend?: boolean
	openKebabId: string | null
	actions: LinkTableRowActions
}

/**
 * Основные действия строки таблицы
 */
export interface LinkTableRowActions {
	// Действия строки
	handleItemClick: (e: React.MouseEvent) => void
	handleTitleClick: (linkId: string, e: React.MouseEvent) => void

	// Действия в ячейке действий
	handleCopy: (url: string, e?: React.MouseEvent) => void
	handleQrClick: (link: LinkItemType, e: React.MouseEvent) => void
	handleAnalyticsClick: (linkId: string, e: React.MouseEvent) => void
	handleKebabClick: (linkId: string, e: React.MouseEvent) => void

	// Действия в kebab меню
	closeKebabMenu: (e: React.MouseEvent) => void
	handleEdit: (linkId: string) => void
	handleToggleStatus: (link: LinkItemType) => void
	handleDelete: (linkId: string) => void
}
