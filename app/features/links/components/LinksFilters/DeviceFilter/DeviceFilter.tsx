'use client'

import cn from 'classnames'
import { Check } from 'lucide-react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'

interface DeviceFilterProps {
	selectedDevice?: string | null
	onDeviceChange?: (deviceType: string | null) => void
	devices?: { type: string; name?: string }[]
}

export default function DeviceFilter({
	selectedDevice,
	onDeviceChange,
	devices = []
}: DeviceFilterProps) {
	return (
		<FilterDropdown
			label='Устройство'
			badgeCount={selectedDevice ? 1 : 0}
			hasSelection={!!selectedDevice}
		>
			<button
				className={cn(commonStyles.dropdownItem, {
					[commonStyles.selected]: !selectedDevice
				})}
				onClick={() => onDeviceChange?.(null)}
			>
				<span className={commonStyles.checkbox} />
				Все
			</button>

			{devices.map(device => (
				<button
					key={device.type}
					className={cn(commonStyles.dropdownItem, {
						[commonStyles.selected]: selectedDevice === device.type
					})}
					onClick={() => onDeviceChange?.(device.type)}
				>
					<span className={commonStyles.checkbox}>
						{selectedDevice === device.type && <Check size={12} />}
					</span>
					{device.type}
				</button>
			))}
		</FilterDropdown>
	)
}
