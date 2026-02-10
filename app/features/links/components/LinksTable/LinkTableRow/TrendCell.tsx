'use client'

import { calculateTrend } from './helpers'
import styles from './LinkTableRow.module.scss'

interface TrendCellProps {
	clicks: number
}

export default function TrendCell({ clicks }: TrendCellProps) {
	const trend = calculateTrend(clicks)
	const trendStyleClass =
		trend.className === 'positive'
			? styles.trendPositive
			: trend.className === 'negative'
				? styles.trendNegative
				: ''

	return (
		<td>
			<span className={`${styles.trend} ${trendStyleClass}`}>
				{trend.text}
			</span>
		</td>
	)
}
