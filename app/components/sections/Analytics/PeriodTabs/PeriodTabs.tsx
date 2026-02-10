import { Period, periodTabs } from '../analytics.config'
import styles from './PeriodTabs.module.scss'

interface PeriodTabsProps {
	activePeriod: Period
	onPeriodChange: (period: Period) => void
}

export default function PeriodTabs({
	activePeriod,
	onPeriodChange
}: PeriodTabsProps) {
	return (
		<div className={styles.tabs}>
			{periodTabs.map(tab => (
				<button
					key={tab.id}
					className={`${styles.tab} ${activePeriod === tab.id ? `${styles.active}` : ''}`}
					onClick={() => onPeriodChange(tab.id)}
				>
					{tab.label}
				</button>
			))}
		</div>
	)
}
