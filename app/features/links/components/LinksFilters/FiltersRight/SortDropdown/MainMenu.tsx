import { SortState } from '@/types/filterLinks'
import cn from 'classnames'
import { SORT_OPTIONS, SORT_ORDER_ICONS } from './sortConfig'
import styles from './SortDropdown.module.scss'

interface MainMenuProps {
	sort: SortState
	setSelectedField: (field: SortState['field'] | null) => void
}

export default function MainMenu({ sort, setSelectedField }: MainMenuProps) {
	return (
		<>
			<div className={styles.dropdownHeader}>Сортировать по:</div>
			{SORT_OPTIONS.map(opt => {
				const isActive = sort.field === opt.field
				const current = isActive
					? opt.subOptions.find(s => s.order === sort.order)?.label
					: null

				return (
					<button
						key={opt.field}
						className={cn(styles.dropdownItem, styles.sortItem, {
							[styles.selected]: isActive
						})}
						onClick={() => setSelectedField(opt.field)}
					>
						<div className={styles.sortItemContent}>
							{opt.icon}
							<span>{opt.label}</span>
						</div>

						{isActive && current && (
							<div className={styles.sortIndicator}>
								{SORT_ORDER_ICONS[sort.order]}
								<span className={styles.currentSortLabel}>
									{current}
								</span>
							</div>
						)}
					</button>
				)
			})}
		</>
	)
}
