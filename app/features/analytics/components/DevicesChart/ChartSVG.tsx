'use client'

import styles from './DevicesChart.module.scss'
import { ChartSegment, DEVICE_CHART_CONFIG } from './helpers'

interface ChartSVGProps {
	segments: ChartSegment[]
	onSegmentHover: (index: number | null) => void
}

export default function ChartSVG({ segments, onSegmentHover }: ChartSVGProps) {
	return (
		<svg
			className={styles.chart}
			viewBox={DEVICE_CHART_CONFIG.viewBox}
			role='img'
			aria-label='Диаграмма распределения устройств'
		>
			{segments.map(segment => (
				<circle
					key={segment.index}
					cx={DEVICE_CHART_CONFIG.cx}
					cy={DEVICE_CHART_CONFIG.cy}
					r={DEVICE_CHART_CONFIG.radius}
					fill='none'
					stroke={segment.color}
					strokeWidth={DEVICE_CHART_CONFIG.strokeWidth}
					strokeDasharray={segment.strokeDasharray}
					strokeDashoffset={segment.strokeDashoffset}
					transform='rotate(-90 100 100)'
					className={styles.segment}
					tabIndex={0}
					role='button'
					aria-label={`${segment.type}: ${segment.percentage}%`}
					onMouseEnter={() => onSegmentHover(segment.index)}
					onMouseLeave={() => onSegmentHover(null)}
					onFocus={() => onSegmentHover(segment.index)}
					onBlur={() => onSegmentHover(null)}
				/>
			))}
		</svg>
	)
}
