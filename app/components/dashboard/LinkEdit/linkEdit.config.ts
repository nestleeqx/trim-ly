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

// Mock existing tags for autocomplete
export const existingTags = [
	'marketing',
	'social',
	'campaign',
	'promo',
	'email',
	'ads',
	'organic',
	'referral'
]

// Reserved/taken aliases for demo
export const takenAliases = ['demo', 'test', 'admin', 'api', 'app']

export const folderOptions = [
	{ value: 'General', label: 'Общая' },
	{ value: 'Marketing', label: 'Маркетинг' },
	{ value: 'Social', label: 'Соцсети' },
	{ value: 'Campaigns', label: 'Кампании' }
]

export const SHORT_LINK_DOMAIN = 't.ly/'
