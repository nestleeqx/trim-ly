import { SortField, SortOrder, SortState } from '@/types/filterLinks'
import cn from 'classnames'
import { Check, ChevronDown } from 'lucide-react'
import styles from './SortDropdown.module.scss'
import { SORT_OPTIONS } from './sortConfig'

interface SubMenuProps {
	sort: SortState
	selectedField: SortState['field']
	setSelectedField: (field: SortState['field'] | null) => void
	onSortChange: (sort: SortState) => void
}

export default function SubMenu({
	sort,
	selectedField,
	setSelectedField,
	onSortChange
}: SubMenuProps) {
	const selectedOption = SORT_OPTIONS.find(o => o.field === selectedField)

	const selectOrder = (field: SortField, order: SortOrder) => {
		onSortChange({ field, order })
		setSelectedField(null)
	}

	return selectedOption ? (
		<>
			<button
				type='button'
				className={cn(styles.dropdownItem, styles.sortBack)}
				onClick={() => setSelectedField(null)}
			>
				<ChevronDown
					size={12}
					className={styles.chevronLeft}
				/>
				Назад к выбору
			</button>

			<div className={styles.dropdownHeader}>{selectedOption.label}</div>

			{selectedOption.subOptions.map(sub => {
				const isActive =
					sort.field === selectedOption.field && sort.order === sub.order
				return (
					<button
						type='button'
						key={sub.order}
						className={cn(styles.dropdownItem, styles.sortSubItem, {
							[styles.selected]: isActive
						})}
						onClick={() => selectOrder(selectedOption.field, sub.order)}
					>
						<span>{sub.label}</span>
						{isActive && <Check size={12} />}
					</button>
				)
			})}
		</>
	) : null
}
