import styles from './BillingTab.module.scss'

interface ProgressBarProps {
	percentage: number
	variant?: 'default' | 'alt'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
	percentage,
	variant = 'default'
}) => {
	const isAlt = variant === 'alt'

	return (
		<div className={`${styles.progressBar} ${isAlt ? styles.progressAlt : ''}`}>
			<div
				className={isAlt ? styles.progressFillAlt : styles.progressFill}
				style={{ width: `${percentage}%` }}
			/>
		</div>
	)
}
