'use client'

import { DeviceStats } from '@/types/charts'
import React from 'react'
import styles from './DevicesChart.module.scss'
import { LegendItem } from './LegendItem'

interface ChartLegendProps {
	devices: DeviceStats[]
	hoveredSegment: number | null
	onSegmentHover: (index: number | null) => void
}

/**
 * ChartLegend - отображает легенду со всеми устройствами
 */
export const ChartLegend: React.FC<ChartLegendProps> = ({
	devices,
	hoveredSegment,
	onSegmentHover
}) => {
	return (
		<div
			className={styles.legend}
			role='list'
			aria-label='Легенда устройств'
		>
			{devices.map((device, index) => (
				<LegendItem
					key={device.type}
					device={device}
					index={index}
					isHovered={hoveredSegment === index}
					onHover={onSegmentHover}
				/>
			))}
		</div>
	)
}
