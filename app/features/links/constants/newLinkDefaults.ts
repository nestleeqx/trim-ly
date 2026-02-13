import {
	LinkEditFormData,
	SHORT_LINK_DOMAIN
} from '@/app/features/links/components/LinkEdit/linkEdit.config'
import { LinkItem } from '@/types/links'

export const EMPTY_LINK: LinkItem = {
	id: 'new',
	title: '',
	shortUrl: `${SHORT_LINK_DOMAIN}`,
	destination: '',
	clicks: 0,
	status: 'active',
	tags: [],
	createdAt: new Date()
}

export const INITIAL_LINK_FORM_DATA: LinkEditFormData = {
	title: '',
	destinationUrl: '',
	shortLink: '',
	tags: [],
	folder: 'General',
	expirationDate: '',
	passwordEnabled: false,
	password: ''
}
