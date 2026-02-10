'use client'

import { StatusFilter as StatusFilterType } from '@/types/filterLinks'
import { Check } from 'lucide-react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'

const statusLabels: Record<StatusFilterType, string> = {
	active: 'Активна',
	paused: 'Пауза',
	expired: 'Истекла',
	deleted: 'Удалена'
}

interface StatusFilterProps {
	selectedStatuses: StatusFilterType[]
	onStatusChange: (statuses: StatusFilterType[]) => void
}

export default function StatusFilter({
	selectedStatuses,
	onStatusChange
}: StatusFilterProps) {
	const toggleStatus = (status: StatusFilterType) => {
		onStatusChange(
			selectedStatuses.includes(status)
				? selectedStatuses.filter(s => s !== status)
				: [...selectedStatuses, status]
		)
	}

	return (
		<FilterDropdown
			label='Статус'
			badgeCount={selectedStatuses.length}
			hasSelection={selectedStatuses.length > 0}
		>
			{(Object.keys(statusLabels) as StatusFilterType[]).map(status => (
				<button
					key={status}
					className={`${commonStyles.dropdownItem} ${selectedStatuses.includes(status) ? commonStyles.selected : ''}`}
					onClick={() => toggleStatus(status)}
				>
					<span className={commonStyles.checkbox}>
						{selectedStatuses.includes(status) && (
							<Check size={12} />
						)}
					</span>
					{statusLabels[status]}
				</button>
			))}
		</FilterDropdown>
	)
}
