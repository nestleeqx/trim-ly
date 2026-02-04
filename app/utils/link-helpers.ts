import { LinkStatus } from '@/types/links'

export const getStatusLabel = (status: LinkStatus): string => {
	const labels: Record<LinkStatus, string> = {
		active: 'Активна',
		paused: 'Пауза',
		expired: 'Истекла',
		deleted: 'Удалена'
	}
	return labels[status]
}
