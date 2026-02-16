'use client'

import { useClickOutside } from '@/hooks/useClickOutside'
import cn from 'classnames'
import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import styles from './ItemsPerPageDropdown.module.scss'

interface ItemsPerPageDropdownProps {
	itemsPerPage: number
	onItemsPerPageChange: (count: number) => void
	options?: number[]
}

const DEFAULT_OPTIONS = [10, 25, 50]

export default function ItemsPerPageDropdown({
	itemsPerPage,
	onItemsPerPageChange,
	options = DEFAULT_OPTIONS
}: ItemsPerPageDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)
	const handleClose = useCallback(() => setIsOpen(false), [])
	const dropdownRef = useClickOutside(handleClose)

	const handleOptionClick = (count: number) => {
		onItemsPerPageChange(count)
		setIsOpen(false)
	}

	return (
		<div className={styles.perPageWrapper}>
			<span className={styles.showLabel}>Показывать</span>
			<div
				className={styles.dropdown}
				ref={dropdownRef}
			>
				<button
					type='button'
					className={styles.dropdownBtn}
					onClick={() => setIsOpen(!isOpen)}
				>
					{itemsPerPage}
					<ChevronDown size={14} />
				</button>

				{isOpen && (
					<div className={styles.dropdownMenu}>
						{options.map(count => (
							<button
								type='button'
								key={count}
								className={cn(styles.dropdownItem, {
									[styles.active]: itemsPerPage === count
								})}
								onClick={() => handleOptionClick(count)}
							>
								{count}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
