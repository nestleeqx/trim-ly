import cn from 'classnames'
import { Check } from 'lucide-react'
import styles from '../ComparisonRow.module.scss'

interface ComparisonCellProps {
	value: string | boolean
	isHighlight?: boolean
}

export default function ComparisonCell({
	value,
	isHighlight
}: ComparisonCellProps) {
	if (typeof value === 'boolean') {
		return (
			<div className={cn(styles.tableCell, styles.center)}>
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
			className={cn(styles.tableCell, styles.center, {
				[styles.highlight]: isHighlight
			})}
		>
			{value}
		</div>
	)
}
