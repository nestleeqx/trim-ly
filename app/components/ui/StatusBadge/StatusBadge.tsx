import { LinkStatus } from '@/types/links'
import { statusConfig } from './StatusBadge.config'
import styles from './StatusBadge.module.scss'

interface StatusBadgeProps {
	status: LinkStatus
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const config = statusConfig[status]

	return (
		<span className={`${styles.statusBadge} ${styles[config.className]}`}>
			{config.label}
		</span>
	)
}

export default StatusBadge
