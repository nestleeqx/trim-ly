import { ComparisonCell } from './ComparisonCell'
import styles from './page.module.scss'
import { ComparisonFeature } from './pricing.config'

interface ComparisonRowProps {
	feature: ComparisonFeature
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({ feature }) => {
	return (
		<div className={styles.tableRow}>
			<div className={`${styles.tableCell} ${styles.featureName}`}>
				{feature.name}
			</div>
			<ComparisonCell value={feature.free} />
			<ComparisonCell
				value={feature.pro}
				isHighlight
			/>
			<ComparisonCell value={feature.team} />
		</div>
	)
}
