import { ChartDataPoint } from '@/types/charts'
import styles from './CustomTooltip.module.scss'

interface CustomTooltipProps {
	active?: boolean
	payload?: Array<{ payload: ChartDataPoint }>
	label?: string
}

export default function CustomTooltip({ active, payload }: CustomTooltipProps) {
	if (!active || !payload || !payload.length) return null

	const data = payload[0].payload

	return (
		<div className={styles.customTooltip}>
			<div className={styles.tooltipDate}>{data.date}</div>
			<div className={styles.tooltipRow}>
				<span className={styles.tooltipLabel}>Клики</span>
				<span
					className={`${styles.tooltipValue} ${styles.tooltipValuePrimary}`}
				>
					{data.value.toLocaleString()}
				</span>
			</div>
			<div className={styles.tooltipRow}>
				<span className={styles.tooltipLabel}>Уникальные</span>
				<span className={styles.tooltipValue}>
					{data.unique.toLocaleString()}
				</span>
			</div>
		</div>
	)
}
