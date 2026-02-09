'use client'

import React from 'react'
import { calculateTrend } from './helpers'
import styles from './LinkTableRow.module.scss'

interface TrendCellProps {
	clicks: number
}

export const TrendCell: React.FC<TrendCellProps> = ({ clicks }) => {
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
