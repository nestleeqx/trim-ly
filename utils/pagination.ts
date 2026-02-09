export function getPageNumbers(
	currentPage: number,
	totalPages: number
): (number | string)[] {
	if (totalPages <= 5) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	const pages: (number | string)[] = [1]
	const start = Math.max(2, currentPage - 1)
	const end = Math.min(totalPages - 1, currentPage + 1)

	if (start > 2) pages.push('...')
	for (let i = start; i <= end; i++) pages.push(i)
	if (end < totalPages - 1) pages.push('...')
	pages.push(totalPages)

	return pages
}
