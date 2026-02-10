import { SortField, SortOrder, SortState } from '@/types/filterLinks'
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
		close()
	}

	return selectedOption ? (
		<>
			<button
				className={`${styles.dropdownItem} ${styles.sortBack}`}
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
					sort.field === selectedOption.field &&
					sort.order === sub.order
				return (
					<button
						key={sub.order}
						className={`${styles.dropdownItem} ${styles.sortSubItem} ${isActive ? styles.selected : ''}`}
						onClick={() =>
							selectOrder(selectedOption.field, sub.order)
						}
					>
						<span>{sub.label}</span>
						{isActive && <Check size={12} />}
					</button>
				)
			})}
		</>
	) : null
}
