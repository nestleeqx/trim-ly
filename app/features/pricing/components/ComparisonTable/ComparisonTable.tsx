import cn from 'classnames'
import { comparisonFeatures } from '../../pricing.config'
import ComparisonRow from './ComparisonRow/ComparisonRow'
import styles from './ComparisonTable.module.scss'

export default function ComparisonTable() {
	return (
		<div className={styles.comparisonSection}>
			<div className={styles.comparisonHeader}>
				<h3 className={styles.comparisonTitle}>Сравнение возможностей</h3>
				<p className={styles.comparisonSubtitle}>
					Найдите подходящий план для вашего рабочего процесса.
				</p>
			</div>

			<div className={styles.comparisonTable}>
				<div className={styles.tableHeader}>
					<div className={styles.tableHeaderCell}>Функция</div>
					<div className={cn(styles.tableHeaderCell, styles.center)}>Free</div>
					<div
						className={cn(
							styles.tableHeaderCell,
							styles.center,
							styles.highlight
						)}
					>
						Pro
					</div>
					<div className={cn(styles.tableHeaderCell, styles.center)}>Team</div>
				</div>

				{comparisonFeatures.map((feature, idx) => (
					<ComparisonRow
						key={idx}
						feature={feature}
					/>
				))}
			</div>
		</div>
	)
}
