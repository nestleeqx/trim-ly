import cn from 'classnames'
import styles from '../Sidebar.module.scss'

interface StorageUsageProps {
	used: number
	max: number
	label?: string
	isLimitReached?: boolean
}

const formatNumber = (num: number): string => {
	if (num >= 1000) {
		return `${num / 1000}k`
	}
	return num.toString()
}

export default function StorageUsage({
	used,
	max,
	label = 'ХРАНИЛИЩЕ',
	isLimitReached = false
}: StorageUsageProps) {
	const usagePercent = max > 0 ? Math.min((used / max) * 100, 100) : 0

	return (
		<div className={styles.storage}>
			<span className={styles.storageLabel}>{label}</span>
			<div className={styles.progressBar}>
				<div
					className={cn(styles.progressFill, {
						[styles.progressFillDanger]: isLimitReached
					})}
					style={{ width: `${usagePercent}%` }}
				/>
			</div>
			<span className={styles.storageText}>
				{formatNumber(used)} из {formatNumber(max)} ссылок
			</span>
		</div>
	)
}
