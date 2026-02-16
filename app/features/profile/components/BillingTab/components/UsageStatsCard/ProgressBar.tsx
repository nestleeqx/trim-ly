import cn from 'classnames'
import styles from '../../BillingTab.module.scss'

interface ProgressBarProps {
	percentage: number
	variant?: 'default' | 'alt'
}

export default function ProgressBar({
	percentage,
	variant = 'default'
}: ProgressBarProps) {
	const isAlt = variant === 'alt'

	return (
		<div
			className={cn(styles.progressBar, {
				[styles.progressAlt]: isAlt
			})}
		>
			<div
				className={isAlt ? styles.progressFillAlt : styles.progressFill}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	)
}
