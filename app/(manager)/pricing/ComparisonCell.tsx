import { Check } from 'lucide-react'
import styles from './page.module.scss'

interface ComparisonCellProps {
	value: string | boolean
	isHighlight?: boolean
}

export const ComparisonCell: React.FC<ComparisonCellProps> = ({
	value,
	isHighlight
}) => {
	if (typeof value === 'boolean') {
		return (
			<div className={`${styles.tableCell} ${styles.center}`}>
				{value ? (
					<Check
						size={18}
						className={styles.checkMark}
					/>
				) : (
					<span className={styles.dash}>—</span>
				)}
			</div>
		)
	}

	return (
		<div
			className={`${styles.tableCell} ${styles.center} ${isHighlight ? styles.highlight : ''}`}
		>
			{value}
		</div>
	)
}
