'use client'

import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import styles from './ItemsPerPageDropdown.module.scss'

interface ItemsPerPageDropdownProps {
	itemsPerPage: number
	onItemsPerPageChange: (count: number) => void
	options?: number[]
}

const defaultOptions = [10, 25, 50]

export const ItemsPerPageDropdown: React.FC<ItemsPerPageDropdownProps> = ({
	itemsPerPage,
	onItemsPerPageChange,
	options = defaultOptions
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const handleOptionClick = (count: number) => {
		onItemsPerPageChange(count)
		setIsDropdownOpen(false)
	}

	return (
		<div className={styles.perPageWrapper}>
			<span className={styles.showLabel}>Показывать</span>
			<div className={styles.dropdown}>
				<button
					className={styles.dropdownBtn}
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				>
					{itemsPerPage}
					<ChevronDown size={14} />
				</button>

				{isDropdownOpen && (
					<>
						<div
							className={styles.dropdownOverlay}
							onClick={() => setIsDropdownOpen(false)}
						/>
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
					</>
				)}
			</div>
		</div>
	)
}