import cn from 'classnames'
import { ComparisonFeature } from '../../../pricing.config'
import ComparisonCell from './ComparisonCell/ComparisonCell'
import styles from './ComparisonRow.module.scss'

interface ComparisonRowProps {
	feature: ComparisonFeature
}

export default function ComparisonRow({ feature }: ComparisonRowProps) {
	return (
		<div className={styles.tableRow}>
			<div className={cn(styles.tableCell, styles.featureName)}>
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
