'use client'

import { useClickOutside } from '@/hooks/useClickOutside'
import { SortField, SortState } from '@/types/filterLinks'
import cn from 'classnames'
import { ArrowUp, ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import MainMenu from './MainMenu'
import { getSortLabel } from './sortConfig'
import styles from './SortDropdown.module.scss'
import SubMenu from './SubMenu'

interface SortDropdownProps {
	sort: SortState
	onSortChange: (sort: SortState) => void
}

export default function SortDropdown({
	sort,
	onSortChange
}: SortDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedField, setSelectedField] = useState<SortField | null>(null)

	const close = useCallback(() => {
		setIsOpen(false)
		setSelectedField(null)
	}, [])

	const dropdownRef = useClickOutside(close)

	const open = () => {
		setIsOpen(v => !v)
		setSelectedField(null)
	}

	return (
		<div className={styles.wrapper}>
			<span className={styles.sortLabel}>СОРТИРОВКА:</span>

			<div
				className={styles.container}
				ref={dropdownRef}
			>
				<button
					className={cn(styles.filterBtn, {
						[styles.open]: isOpen
					})}
					onClick={open}
				>
					<ArrowUp size={14} />
					{getSortLabel(sort.field, sort.order)}
					<ChevronDown size={14} />
				</button>

				{isOpen && (
					<div className={cn(styles.dropdown, styles.sortDropdown)}>
						{selectedField ? (
							<SubMenu
								sort={sort}
								setSelectedField={setSelectedField}
								selectedField={selectedField}
								onSortChange={onSortChange}
							/>
						) : (
							<MainMenu
								sort={sort}
								setSelectedField={setSelectedField}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
