'use client'

import { DeviceStats } from '@/types/charts'
import { useMemo, useState } from 'react'
import CenterLabel from './CenterLabel'
import ChartLegend from './ChartLegend'
import ChartSVG from './ChartSVG'
import styles from './DevicesChart.module.scss'
import { calculateSegments } from './helpers'

interface DevicesChartProps {
	deviceStats: DeviceStats[]
	mainPercentage: number
	mainDeviceType: string
}

export default function DevicesChart({
	deviceStats,
	mainPercentage,
	mainDeviceType
}: DevicesChartProps) {
	const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

	const segments = useMemo(() => calculateSegments(deviceStats), [deviceStats])
	const hoveredDevice =
		hoveredSegment !== null ? deviceStats[hoveredSegment] : null
	const hasData = deviceStats.length > 0

	return (
		<div className={styles.card}>
			<h3 className={styles.title}>Устройства</h3>

			{hasData ? (
				<>
					<div className={styles.chartWrapper}>
						<div className={styles.chartContainer}>
							<ChartSVG
								segments={segments}
								onSegmentHover={setHoveredSegment}
							/>

							<CenterLabel
								mainPercentage={mainPercentage}
								mainDeviceType={mainDeviceType}
								hoveredDevice={hoveredDevice}
							/>
						</div>
					</div>

					<ChartLegend
						devices={deviceStats}
						hoveredSegment={hoveredSegment}
						onSegmentHover={setHoveredSegment}
					/>
				</>
			) : (
				<p className={styles.empty}>Нет данных за выбранный период.</p>
			)}
		</div>
	)
}
