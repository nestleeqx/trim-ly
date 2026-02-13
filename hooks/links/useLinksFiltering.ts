import { LinkItem, LinksFiltersState } from '@/types/links'
import { useMemo } from 'react'

const compareNullableNumbers = (
	a: number | null | undefined,
	b: number | null | undefined,
	dir: 1 | -1
) => {
	const av = a ?? Number.NEGATIVE_INFINITY
	const bv = b ?? Number.NEGATIVE_INFINITY
	return (av - bv) * dir
}

const compareStrings = (a: string, b: string, dir: 1 | -1) =>
	a.localeCompare(b, 'ru') * dir

const sortLinks = (
	links: LinkItem[],
	sortConfig: LinksFiltersState['sort']
) => {
	const dir: 1 | -1 = sortConfig.order === 'asc' ? 1 : -1

	return [...links].sort((a, b) => {
		switch (sortConfig.field) {
			case 'created_date':
				return compareNullableNumbers(
					new Date(a.createdAt).getTime(),
					new Date(b.createdAt).getTime(),
					dir
				)

			case 'clicks':
				return compareNullableNumbers(a.clicks, b.clicks, dir)

			case 'title':
				return compareStrings(a.title || '', b.title || '', dir)

			case 'status': {
				const statusOrder = {
					active: 0,
					paused: 1,
					expired: 2,
					deleted: 3
				}
				return compareNullableNumbers(
					statusOrder[a.status],
					statusOrder[b.status],
					dir
				)
			}

			case 'expiration_date': {
				const ea = a.expirationDate
					? new Date(a.expirationDate).getTime()
					: null
				const eb = b.expirationDate
					? new Date(b.expirationDate).getTime()
					: null
				return compareNullableNumbers(ea, eb, dir)
			}

			default:
				return 0
		}
	})
}

export const useLinksFiltering = (
	links: LinkItem[],
	appliedSearch: string,
	filters: LinksFiltersState
) => {
	const filteredAndSortedLinks = useMemo(() => {
		let filtered = [...links]

		if (appliedSearch.trim()) {
			const query = appliedSearch.toLowerCase()
			filtered = filtered.filter(
				link =>
					link.title.toLowerCase().includes(query) ||
					link.shortUrl.toLowerCase().includes(query) ||
					link.destination.toLowerCase().includes(query)
			)
		}

		if (filters.statuses.length > 0) {
			filtered = filtered.filter(link =>
				filters.statuses.includes(link.status)
			)
		}

		if (filters.tags.length > 0) {
			filtered = filtered.filter(link =>
				filters.tags.some(tag => link.tags.includes(tag))
			)
		}

		return sortLinks(filtered, filters.sort)
	}, [links, appliedSearch, filters])

	const hasActiveFilters = useMemo(() => {
		return (
			appliedSearch.trim() !== '' ||
			filters.statuses.length > 0 ||
			filters.tags.length > 0 ||
			filters.datePreset !== null ||
			!!filters.createdFrom ||
			!!filters.createdTo
		)
	}, [
		appliedSearch,
		filters.statuses,
		filters.tags,
		filters.datePreset,
		filters.createdFrom,
		filters.createdTo
	])

	return {
		filteredAndSortedLinks,
		hasActiveFilters
	}
}
