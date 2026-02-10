import { LinkItem as LinkItemType } from '@/types/links'

export interface LinkTableRowProps {
	link: LinkItemType
	isSelected?: boolean
	onSelectLink?: (id: string, checked: boolean) => void
	allowSelection?: boolean
	showActions?: boolean
	showTrend?: boolean
	openKebabId: string | null
	actions: LinkActions
}

export interface LinkActions {
	handleItemClick: (e: React.MouseEvent) => void
	handleTitleClick: (linkId: string, e: React.MouseEvent) => void

	handleCopy: (url: string, e?: React.MouseEvent) => void
	handleQrClick: (link: LinkItemType, e: React.MouseEvent) => void
	handleAnalyticsClick: (linkId: string, e: React.MouseEvent) => void
	handleKebabClick: (linkId: string, e: React.MouseEvent) => void

	closeKebabMenu: (e: React.MouseEvent) => void
	handleEdit: (linkId: string) => void
	handleToggleStatus: (link: LinkItemType) => void
	handleDelete: (linkId: string) => void
}
