'use client'

import { useClickOutside } from '@/hooks/useClickOutside'
import { ChevronDown } from 'lucide-react'
import { useCallback, useState } from 'react'
import styles from './ItemsPerPageDropdown.module.scss'

interface ItemsPerPageDropdownProps {
	itemsPerPage: number
	onItemsPerPageChange: (count: number) => void
	options?: number[]
}

const DEFAULT_OPTIONS = [10, 25, 50]

const ItemsPerPageDropdown: React.FC<ItemsPerPageDropdownProps> = ({
	itemsPerPage,
	onItemsPerPageChange,
	options = DEFAULT_OPTIONS
}) => {
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
								key={count}
								className={`${styles.dropdownItem} ${itemsPerPage === count ? styles.active : ''}`}
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

export default ItemsPerPageDropdown
