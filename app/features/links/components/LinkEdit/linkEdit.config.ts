import { buildShortLink } from '@/app/features/links/utils/shortLink'

export interface LinkEditFormData {
	destinationUrl: string
	shortLink: string
	title: string
	tags: string[]
	folder: string
	expirationDate: string
	passwordEnabled: boolean
	password: string
}

export const MAX_TAG_LENGTH = 20

export const defaultFormData: LinkEditFormData = {
	destinationUrl: '',
	shortLink: '',
	title: '',
	tags: [],
	folder: 'General',
	expirationDate: '',
	passwordEnabled: false,
	password: ''
}

export const takenAliases = ['demo', 'test', 'admin', 'api', 'app']

export const SHORT_LINK_DOMAIN = buildShortLink()

export const statusLabels = {
	active: 'Активна',
	paused: 'На паузе',
	expired: 'Истекла',
	deleted: 'Удалена'
} as const
