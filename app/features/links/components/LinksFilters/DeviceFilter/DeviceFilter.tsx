'use client'

import { mockDeviceStats } from '@/data/mockDashboardData'
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
	devices = mockDeviceStats.map(d => ({ type: d.type }))
}: DeviceFilterProps) {
	return (
		<FilterDropdown
			label='Устройство'
			badgeCount={selectedDevice ? 1 : 0}
			hasSelection={!!selectedDevice}
		>
			<button
				className={`${commonStyles.dropdownItem} ${!selectedDevice ? commonStyles.selected : ''}`}
				onClick={() => onDeviceChange?.(null)}
			>
				<span className={commonStyles.checkbox} />
				Все
			</button>

			{devices.map(device => (
				<button
					key={device.type}
					className={`${commonStyles.dropdownItem} ${selectedDevice === device.type ? commonStyles.selected : ''}`}
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
