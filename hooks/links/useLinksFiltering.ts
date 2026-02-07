import { LinkItem, LinksFiltersState } from '@/types/links'
import { useMemo } from 'react'

const sortLinks = (links: LinkItem[], sortConfig: LinksFiltersState['sort']) => {
	return [...links].sort((a, b) => {
		const order = sortConfig.order === 'asc' ? 1 : -1

		switch (sortConfig.field) {
			case 'created_date':
				return (
					(new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) *
					order
				)

			case 'clicks':
				return (b.clicks - a.clicks) * order

			case 'title':
				return a.title.localeCompare(b.title, 'ru') * order

			case 'status': {
				const statusOrder = {
					active: 0,
					paused: 1,
					expired: 2,
					deleted: 3
				}
				return (statusOrder[a.status] - statusOrder[b.status]) * order
			}

			case 'expiration_date': {
				const dateA = a.expirationDate ? new Date(a.expirationDate).getTime() : 0
				const dateB = b.expirationDate ? new Date(b.expirationDate).getTime() : 0
				return (dateB - dateA) * order
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
			filtered = filtered.filter(link => filters.statuses.includes(link.status))
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
			filters.datePreset !== null
		)
	}, [appliedSearch, filters.statuses, filters.tags, filters.datePreset])

	return {
		filteredAndSortedLinks,
		hasActiveFilters
	}
}
