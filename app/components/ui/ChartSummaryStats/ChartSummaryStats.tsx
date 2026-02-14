import styles from './ChartSummaryStats.module.scss'

interface ChartSummaryStatsProps {
	total: string
	average: string
	totalLabel?: string
	averageLabel?: string
	className?: string
}

export default function ChartSummaryStats({
	total,
	average,
	totalLabel = 'ВСЕГО КЛИКОВ',
	averageLabel = 'СРЕДНЕЕ В ДЕНЬ',
	className
}: ChartSummaryStatsProps) {
	return (
		<div className={`${styles.stats} ${className ?? ''}`.trim()}>
			<div className={styles.stat}>
				<span className={styles.statLabel}>{totalLabel}</span>
				<span className={styles.statValue}>{total}</span>
			</div>
			<div className={styles.stat}>
				<span className={styles.statLabel}>{averageLabel}</span>
				<span className={styles.statValue}>{average}</span>
			</div>
		</div>
	)
}
