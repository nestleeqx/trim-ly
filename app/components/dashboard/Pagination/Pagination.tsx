'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ItemsPerPageDropdown } from './ItemsPerPageDropdown/ItemsPerPageDropdown'
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

	const handlePrevPage = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1)
		}
	}

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1)
		}
	}

	const handlePageClick = (page: number) => {
		onPageChange(page)
	}

	const getPageNumbers = () => {
		const pages: (number | string)[] = []
		const maxVisible = 5

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			pages.push(1)

			const start = Math.max(2, currentPage - 1)
			const end = Math.min(totalPages - 1, currentPage + 1)

			if (start > 2) {
				pages.push('...')
			}

			for (let i = start; i <= end; i++) {
				pages.push(i)
			}

			if (end < totalPages - 1) {
				pages.push('...')
			}

			pages.push(totalPages)
		}

		const uniquePages: (number | string)[] = []
		pages.forEach((page, index) => {
			const last = uniquePages[uniquePages.length - 1]

			if (page === '...' && last === '...') return

			if (
				typeof page === 'number' &&
				typeof last === 'number' &&
				page === last
			)
				return
			uniquePages.push(page)
		})

		if (uniquePages.length >= 3) {
			if (
				uniquePages[0] === 1 &&
				uniquePages[1] === '...' &&
				typeof uniquePages[2] === 'number' &&
				(uniquePages[2] as number) === 2
			) {
				uniquePages.splice(1, 1)
			}
			if (
				uniquePages[uniquePages.length - 3] === totalPages - 1 &&
				uniquePages[uniquePages.length - 2] === '...' &&
				uniquePages[uniquePages.length - 1] === totalPages
			) {
				uniquePages.splice(uniquePages.length - 2, 1)
			}
		}

		return uniquePages
	}

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
					onClick={handlePrevPage}
					disabled={currentPage === 1}
					aria-label='Предыдущая страница'
				>
					<ChevronLeft size={18} />
				</button>

				<div className={styles.pages}>
					{getPageNumbers().map((page, index) =>
						typeof page === 'number' ? (
							<button
								key={index}
								className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
								onClick={() => handlePageClick(page)}
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
					onClick={handleNextPage}
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
