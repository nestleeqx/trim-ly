import { LinkStatus } from '@/types/links'
import { statusConfig } from './StatusBadge.config'
import styles from './StatusBadge.module.scss'

interface StatusBadgeProps {
	status: LinkStatus
	className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
	const config = statusConfig[status]

	return (
		<span
			className={`${styles.statusBadge} ${styles[config.className]} ${className}`}
		>
			{config.label}
		</span>
	)
}
