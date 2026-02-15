'use client'

import { calculateTrend } from './helpers'
import styles from './LinkTableRow.module.scss'

interface TrendCellProps {
	trend: number
}

export default function TrendCell({ trend: trendValue }: TrendCellProps) {
	const trend = calculateTrend(trendValue)
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
