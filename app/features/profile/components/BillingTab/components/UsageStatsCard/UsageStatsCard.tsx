import { UsageMetric } from '../../billing.config'
import styles from '../../BillingTab.module.scss'
import ProgressBar from './ProgressBar'

interface UsageStatsCardProps {
	metrics: UsageMetric[]
	limitNotice?: string | null
}

export default function UsageStatsCard({
	metrics,
	limitNotice = null
}: UsageStatsCardProps) {
	return (
		<div className={styles.usageCard}>
			{metrics.map(metric => (
				<div key={metric.label}>
					<div className={styles.usageRow}>
						<div className={styles.usageLabel}>{metric.label}</div>
						<div className={styles.usageValue}>
							{metric.current} / {metric.total}
						</div>
					</div>
					<ProgressBar
						percentage={metric.percentage}
						variant={metric.variant}
					/>
				</div>
			))}
			{limitNotice && (
				<div
					className={styles.usageLimitNotice}
					role='status'
				>
					{limitNotice}
				</div>
			)}
		</div>
	)
}
