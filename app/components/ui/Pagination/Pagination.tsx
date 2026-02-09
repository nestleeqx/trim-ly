'use client'

import { getPageNumbers } from '@/utils/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import ItemsPerPageDropdown from '../ItemsPerPageDropdown/ItemsPerPageDropdown'
import styles from './Pagination.module.scss'

interface PaginationProps {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	onPageChange: (page: number) => void
	onItemsPerPageChange: (count: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange
}) => {
	const startItem = (currentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(currentPage * itemsPerPage, totalItems)
	const pages = useMemo(
		() => getPageNumbers(currentPage, totalPages),
		[currentPage, totalPages]
	)

	return (
		<div className={styles.pagination}>
			<div className={styles.info}>
				<span className={styles.showing}>
					Показано <strong>{startItem}</strong> —{' '}
					<strong>{endItem}</strong> из <strong>{totalItems}</strong>{' '}
					ссылок
				</span>

				<ItemsPerPageDropdown
					itemsPerPage={itemsPerPage}
					onItemsPerPageChange={onItemsPerPageChange}
				/>
			</div>

			<div className={styles.controls}>
				<button
					className={styles.navBtn}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label='Предыдущая страница'
				>
					<ChevronLeft size={18} />
				</button>

				<div className={styles.pages}>
					{pages.map((page, index) =>
						typeof page === 'number' ? (
							<button
								key={index}
								className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
								onClick={() => onPageChange(page)}
							>
								{page}
							</button>
						) : (
							<span
								key={index}
								className={styles.ellipsis}
							>
								{page}
							</span>
						)
					)}
				</div>

				<button
					className={styles.navBtn}
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label='Следующая страница'
				>
					<ChevronRight size={18} />
				</button>
			</div>
		</div>
	)
}

export default Pagination
