import { UsageMetric } from './billing.config'
import styles from './BillingTab.module.scss'
import { ProgressBar } from './ProgressBar'

interface UsageStatsCardProps {
	metrics: UsageMetric[]
}

export const UsageStatsCard: React.FC<UsageStatsCardProps> = ({ metrics }) => {
	return (
		<div className={styles.usageCard}>
			{metrics.map((metric, index) => (
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
		</div>
	)
}
