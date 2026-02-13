'use client'

import { getPageNumbers } from '@/utils/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import ItemsPerPageDropdown from './ItemsPerPageDropdown/ItemsPerPageDropdown'
import styles from './Pagination.module.scss'

interface PaginationProps {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	onPageChange: (page: number) => void
	onItemsPerPageChange: (count: number) => void
}

export default function Pagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange
}: PaginationProps) {
	if (totalItems === 0) return null

	const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
	const startItem = (safeCurrentPage - 1) * itemsPerPage + 1
	const endItem = Math.min(safeCurrentPage * itemsPerPage, totalItems)
	const pages = useMemo(
		() => getPageNumbers(safeCurrentPage, totalPages),
		[safeCurrentPage, totalPages]
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
					type='button'
					className={styles.navBtn}
					onClick={() => onPageChange(Math.max(safeCurrentPage - 1, 1))}
					disabled={safeCurrentPage === 1}
					aria-label='Предыдущая страница'
				>
					<ChevronLeft size={18} />
				</button>

				<div className={styles.pages}>
					{pages.map((page, index) =>
						typeof page === 'number' ? (
							<button
								type='button'
								key={index}
								className={`${styles.pageBtn} ${safeCurrentPage === page ? styles.active : ''}`}
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
					type='button'
					className={styles.navBtn}
					onClick={() =>
						onPageChange(Math.min(safeCurrentPage + 1, totalPages))
					}
					disabled={safeCurrentPage === totalPages}
					aria-label='Следующая страница'
				>
					<ChevronRight size={18} />
				</button>
			</div>
		</div>
	)
}
