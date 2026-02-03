'use client'

import React, { useState } from 'react'
import styles from './DevicesChart.module.scss'

interface Device {
	name: string
	percentage: number
	color: string
}

const devices: Device[] = [
	{ name: 'Мобильные', percentage: 62, color: '#4f46e5' },
	{ name: 'Десктоп', percentage: 34, color: '#a5b4fc' },
	{ name: 'Планшет', percentage: 4, color: '#e0e7ff' }
]

const DevicesChart: React.FC = () => {
	const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

	const radius = 80
	const strokeWidth = 20
	const circumference = 2 * Math.PI * radius
	let cumulativePercentage = 0

	const segments = devices.map((device, index) => {
		const strokeDasharray = `${(device.percentage / 100) * circumference} ${circumference}`
		const strokeDashoffset = -((cumulativePercentage / 100) * circumference)
		cumulativePercentage += device.percentage
		return {
			...device,
			index,
			strokeDasharray,
			strokeDashoffset
		}
	})

	const hoveredDevice =
		hoveredSegment !== null ? devices[hoveredSegment] : null

	return (
		<div className={styles.card}>
			<h3 className={styles.title}>Устройства</h3>

			<div className={styles.chartWrapper}>
				<div className={styles.chartContainer}>
					<svg
						className={styles.chart}
						viewBox='0 0 200 200'
						role='img'
						aria-label='Диаграмма распределения устройств'
					>
						{segments.map(segment => (
							<circle
								key={segment.index}
								cx='100'
								cy='100'
								r={radius}
								fill='none'
								stroke={segment.color}
								strokeWidth={strokeWidth}
								strokeDasharray={segment.strokeDasharray}
								strokeDashoffset={segment.strokeDashoffset}
								transform='rotate(-90 100 100)'
								className={styles.segment}
								tabIndex={0}
								role='button'
								aria-label={`${segment.name}: ${segment.percentage}%`}
								onMouseEnter={() =>
									setHoveredSegment(segment.index)
								}
								onMouseLeave={() => setHoveredSegment(null)}
								onFocus={() => setHoveredSegment(segment.index)}
								onBlur={() => setHoveredSegment(null)}
							/>
						))}
					</svg>

					<div
						className={styles.centerLabel}
						aria-live='polite'
					>
						<span className={styles.mainPercentage}>
							{hoveredDevice ? hoveredDevice.percentage : 62}%
						</span>
						<span className={styles.deviceType}>
							{hoveredDevice
								? hoveredDevice.name.toUpperCase()
								: 'МОБИЛЬНЫЕ'}
						</span>
					</div>
				</div>
			</div>

			<div
				className={styles.legend}
				role='list'
				aria-label='Легенда устройств'
			>
				{devices.map((device, index) => (
					<div
						key={device.name}
						className={`${styles.legendItem} ${
							hoveredSegment === index ? styles.active : ''
						}`}
						role='listitem'
						tabIndex={0}
						onMouseEnter={() => setHoveredSegment(index)}
						onMouseLeave={() => setHoveredSegment(null)}
						onFocus={() => setHoveredSegment(index)}
						onBlur={() => setHoveredSegment(null)}
					>
						<span
							className={styles.dot}
							style={{ backgroundColor: device.color }}
							aria-hidden='true'
						/>
						<span className={styles.legendName}>{device.name}</span>
						<span className={styles.legendPercentage}>
							{device.percentage}%
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default DevicesChart
