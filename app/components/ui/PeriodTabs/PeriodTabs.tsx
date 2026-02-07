import { Period, periodTabs } from '../../sections/Analytics/analytics.config'
import styles from './PeriodTabs.module.scss'

interface PeriodTabsProps {
	activePeriod: Period
	onPeriodChange: (period: Period) => void
}

const PeriodTabs: React.FC<PeriodTabsProps> = ({
	activePeriod,
	onPeriodChange
}) => {
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

export default PeriodTabs
