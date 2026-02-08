import { LinkStatus } from '@/types/links'
import sharedStyles from './shared.module.scss'

export const getStatusClass = (status: LinkStatus): string => {
	const classes: Record<LinkStatus, string> = {
		active: sharedStyles.active,
		paused: sharedStyles.paused,
		expired: sharedStyles.expired,
		deleted: sharedStyles.deleted
	}
	return classes[status]
}
