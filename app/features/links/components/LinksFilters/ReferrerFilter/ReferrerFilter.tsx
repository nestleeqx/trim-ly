'use client'

import { mockTopReferrers } from '@/data/mockDashboardData'
import { Check } from 'lucide-react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'

interface ReferrerFilterProps {
	selectedReferrer?: string | null
	onReferrerChange?: (referrer: string | null) => void
	referrers?: { name: string }[]
}

export default function ReferrerFilter({
	selectedReferrer,
	onReferrerChange,
	referrers = mockTopReferrers.map(item => ({ name: item.name }))
}: ReferrerFilterProps) {
	return (
		<FilterDropdown
			label='Источник'
			badgeCount={selectedReferrer ? 1 : 0}
			hasSelection={!!selectedReferrer}
		>
			<button
				type='button'
				className={`${commonStyles.dropdownItem} ${!selectedReferrer ? commonStyles.selected : ''}`}
				onClick={() => onReferrerChange?.(null)}
			>
				<span className={commonStyles.checkbox} />
				Все
			</button>

			{referrers.map(referrer => (
				<button
					type='button'
					key={referrer.name}
					className={`${commonStyles.dropdownItem} ${selectedReferrer === referrer.name ? commonStyles.selected : ''}`}
					onClick={() => onReferrerChange?.(referrer.name)}
				>
					<span className={commonStyles.checkbox}>
						{selectedReferrer === referrer.name && <Check size={12} />}
					</span>
					{referrer.name}
				</button>
			))}
		</FilterDropdown>
	)
}
