'use client'

import { DeviceStats } from '@/types/charts'
import React from 'react'
import styles from './DevicesChart.module.scss'

interface LegendItemProps {
	device: DeviceStats
	isHovered: boolean
	onHover: (index: number | null) => void
	index: number
}

export const LegendItem: React.FC<LegendItemProps> = ({
	device,
	isHovered,
	onHover,
	index
}) => {
	return (
		<div
			className={`${styles.legendItem} ${isHovered ? styles.active : ''}`}
			role='listitem'
			tabIndex={0}
			onMouseEnter={() => onHover(index)}
			onMouseLeave={() => onHover(null)}
			onFocus={() => onHover(index)}
			onBlur={() => onHover(null)}
		>
			<span
				className={styles.dot}
				style={{ backgroundColor: device.color }}
				aria-hidden='true'
			/>
			<span className={styles.legendName}>{device.type}</span>
			<span className={styles.legendPercentage}>
				{device.percentage}%
			</span>
		</div>
	)
}
