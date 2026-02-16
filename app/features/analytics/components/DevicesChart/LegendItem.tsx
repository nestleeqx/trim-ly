'use client'

import { DeviceStats } from '@/types/charts'
import cn from 'classnames'
import styles from './DevicesChart.module.scss'

interface LegendItemProps {
	device: DeviceStats
	isHovered: boolean
	onHover: (index: number | null) => void
	index: number
}

export default function LegendItem({
	device,
	isHovered,
	onHover,
	index
}: LegendItemProps) {
	return (
		<div
			className={cn(styles.legendItem, {
				[styles.active]: isHovered
			})}
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
