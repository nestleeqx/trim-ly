'use client'

import { DeviceStats } from '@/types/charts'
import styles from './DevicesChart.module.scss'

interface CenterLabelProps {
	mainPercentage: number
	mainDeviceType: string
	hoveredDevice: DeviceStats | null
}

export default function CenterLabel({
	mainPercentage,
	mainDeviceType,
	hoveredDevice
}: CenterLabelProps) {
	const displayPercentage = hoveredDevice
		? hoveredDevice.percentage
		: mainPercentage
	const displayType = hoveredDevice
		? hoveredDevice.type.toUpperCase()
		: mainDeviceType.toUpperCase()

	return (
		<div
			className={styles.centerLabel}
			aria-live='polite'
		>
			<span className={styles.mainPercentage}>{displayPercentage}%</span>
			<span className={styles.deviceType}>{displayType}</span>
		</div>
	)
}
