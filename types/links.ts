export interface LinkItem {
	id: string
	title: string
	shortUrl: string
	destination: string
	clicks: number
	status: LinkStatus
	tags: string[]
	createdAt: Date
	expirationDate?: Date
	hasPassword?: boolean
}

export interface ClickEvent {
	time: string
	country: {
		code: string
		name: string
	}
	device: {
		type: string
		name: string
	}
	browser: string
	referrer: string
}

export type LinkStatus = 'active' | 'paused' | 'expired' | 'deleted'

export type ModalAction =
	| 'pause'
	| 'resume'
	| 'restore'
	| 'delete'
	| 'delete-single'
	| 'pause-single'
	| 'resume-single'
	| 'restore-single'
	| null

export interface ConfirmModalState {
	isOpen: boolean
	action: ModalAction
	itemId?: string
	itemTitle?: string
}

export interface LinksFiltersState {
	statuses: LinkStatus[]
	tags: string[]
	datePreset: '7d' | '30d' | 'custom' | null
	createdFrom?: string | null
	createdTo?: string | null
	sort: {
		field: SortField
		order: 'asc' | 'desc'
	}
}

export type SortField =
	| 'created_date'
	| 'clicks'
	| 'title'
	| 'status'
	| 'expiration_date'

export const VALID_PAGE_SIZES = [10, 25, 50] as const
export const VALID_SORT_FIELDS: SortField[] = [
	'created_date',
	'clicks',
	'title',
	'status',
	'expiration_date'
]
export const VALID_STATUSES: LinkStatus[] = [
	'active',
	'paused',
	'expired',
	'deleted'
]

export interface ModalConfig {
	title: string
	message: string
	confirmText: string
	variant: 'danger' | 'warning'
}

export const getModalConfig = (
	action: ModalAction,
	selectedCount: number,
	itemTitle?: string
): ModalConfig => {
	switch (action) {
		case 'pause':
			return {
				title: 'Приостановить ссылки',
				message: `Вы уверены, что хотите приостановить ${selectedCount} ссылок? Они перестанут перенаправлять пользователей.`,
				confirmText: 'Приостановить',
				variant: 'warning'
			}
		case 'resume':
			return {
				title: 'Возобновить ссылки',
				message: `Вы уверены, что хотите возобновить ${selectedCount} ссылок?`,
				confirmText: 'Возобновить',
				variant: 'warning'
			}
		case 'restore':
			return {
				title: 'Восстановить ссылки',
				message: `Вы уверены, что хотите восстановить ${selectedCount} ссылок?`,
				confirmText: 'Восстановить',
				variant: 'warning'
			}
		case 'delete':
			return {
				title: 'Удалить ссылки',
				message: `Вы уверены, что хотите удалить ${selectedCount} ссылок? Это действие необратимо.`,
				confirmText: 'Удалить',
				variant: 'danger'
			}
		case 'delete-single':
			return {
				title: 'Удалить ссылку',
				message: `Вы уверены, что хотите удалить ссылку "${itemTitle}"? Это действие необратимо.`,
				confirmText: 'Удалить',
				variant: 'danger'
			}
		case 'pause-single':
			return {
				title: 'Приостановить ссылку',
				message: `Вы уверены, что хотите приостановить ссылку "${itemTitle}"? Она перестанет перенаправлять пользователей.`,
				confirmText: 'Приостановить',
				variant: 'warning'
			}
		case 'resume-single':
			return {
				title: 'Возобновить ссылку',
				message: `Вы уверены, что хотите возобновить ссылку "${itemTitle}"?`,
				confirmText: 'Возобновить',
				variant: 'warning'
			}
		case 'restore-single':
			return {
				title: 'Восстановить ссылку',
				message: `Вы уверены, что хотите восстановить ссылку "${itemTitle}"?`,
				confirmText: 'Восстановить',
				variant: 'warning'
			}
		default:
			return {
				title: '',
				message: '',
				confirmText: '',
				variant: 'danger'
			}
	}
}
