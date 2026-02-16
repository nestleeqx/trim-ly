'use client'

import { useMemo, useState } from 'react'

interface UsePaginationProps<T> {
	data: T[]
	initialPage?: number
	initialItemsPerPage?: number
}

export const usePagination = <T>({
	data,
	initialPage = 1,
	initialItemsPerPage = 10
}: UsePaginationProps<T>) => {
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

	const totalItems = data.length
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))
	const safeCurrentPage = Math.min(currentPage, totalPages)

	const paginatedData = useMemo(() => {
		const start = (safeCurrentPage - 1) * itemsPerPage
		return data.slice(start, start + itemsPerPage)
	}, [data, safeCurrentPage, itemsPerPage])

	const handlePageChange = (page: number) => {
		const safePage = Math.min(Math.max(page, 1), totalPages)
		setCurrentPage(safePage)
	}

	const handleItemsPerPageChange = (count: number) => {
		setItemsPerPage(count)
		setCurrentPage(1)
	}

	return {
		currentPage: safeCurrentPage,
		itemsPerPage,
		totalItems,
		totalPages,
		paginatedData,
		handlePageChange,
		handleItemsPerPageChange
	}
}
