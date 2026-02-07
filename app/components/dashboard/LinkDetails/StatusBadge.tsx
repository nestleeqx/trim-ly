import { LinkStatus } from '@/types/links'
import styles from './LinkDetails.module.scss'
import { statusConfig } from './linkDetails.config'

interface StatusBadgeProps {
	status: LinkStatus
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const config = statusConfig[status]

	return (
		<span className={`${styles.statusBadge} ${styles[config.className]}`}>
			{config.label}
		</span>
	)
}
