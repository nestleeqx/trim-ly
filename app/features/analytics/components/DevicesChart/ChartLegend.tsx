'use client'

import { DeviceStats } from '@/types/charts'
import styles from './DevicesChart.module.scss'
import LegendItem from './LegendItem'

interface ChartLegendProps {
	devices: DeviceStats[]
	hoveredSegment: number | null
	onSegmentHover: (index: number | null) => void
}

export default function ChartLegend({
	devices,
	hoveredSegment,
	onSegmentHover
}: ChartLegendProps) {
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
