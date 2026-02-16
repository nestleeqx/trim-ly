import { LinkStatus } from '@/types/links'

interface StatusConfig {
	label: string
	className: string
}

export const statusConfig: Record<LinkStatus, StatusConfig> = {
	active: { label: 'АКТИВНА', className: 'active' },
	paused: { label: 'ПАУЗА', className: 'paused' },
	expired: { label: 'ИСТЕКЛА', className: 'expired' },
	deleted: { label: 'УДАЛЕНА', className: 'deleted' }
}
