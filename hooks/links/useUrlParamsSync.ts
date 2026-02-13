import {
	LinksFiltersState,
	SortField,
	VALID_PAGE_SIZES,
	VALID_SORT_FIELDS,
	VALID_STATUSES
} from '@/types/links'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export interface UrlParamsConfig {
	page: number
	pageSize: number
	search: string
	statuses: string[]
	tags: string[]
	datePreset: '7d' | '30d' | 'custom' | null
	createdFrom: string | null
	createdTo: string | null
	sort: { field: SortField; order: 'asc' | 'desc' }
}

export const useUrlParamsSync = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const getInitialPage = useCallback(() => {
		const page = parseInt(searchParams.get('page') || '1', 10)
		return page > 0 ? page : 1
	}, [searchParams])

	const getInitialPageSize = useCallback(() => {
		const size = parseInt(searchParams.get('pageSize') || '10', 10)
		return VALID_PAGE_SIZES.includes(
			size as (typeof VALID_PAGE_SIZES)[number]
		)
			? size
			: 10
	}, [searchParams])

	const getInitialSearch = useCallback(
		() => searchParams.get('search') || '',
		[searchParams]
	)

	const getInitialStatuses = useCallback(() => {
		const statuses = searchParams.get('status')
		if (!statuses) return []
		return statuses
			.split(',')
			.filter(s =>
				VALID_STATUSES.includes(s as (typeof VALID_STATUSES)[number])
			)
	}, [searchParams])

	const getInitialTags = useCallback(() => {
		const tags = searchParams.get('tag')
		return tags ? tags.split(',') : []
	}, [searchParams])

	const getInitialSort = useCallback(() => {
		const sortParam = searchParams.get('sort') || 'created_date'
		const orderParam = searchParams.get('order') || 'desc'
		const field = VALID_SORT_FIELDS.includes(sortParam as SortField)
			? (sortParam as SortField)
			: 'created_date'
		const order = orderParam === 'asc' ? 'asc' : 'desc'
		return { field, order: order as 'asc' | 'desc' }
	}, [searchParams])

	const getInitialFilters = useCallback(
		(): LinksFiltersState => ({
			statuses: getInitialStatuses(),
			tags: getInitialTags(),
			datePreset:
				searchParams.get('datePreset') === '7d' ||
				searchParams.get('datePreset') === '30d' ||
				searchParams.get('datePreset') === 'custom'
					? (searchParams.get('datePreset') as '7d' | '30d' | 'custom')
					: null,
			createdFrom: searchParams.get('createdFrom') || null,
			createdTo: searchParams.get('createdTo') || null,
			sort: getInitialSort()
		}),
		[getInitialStatuses, getInitialTags, getInitialSort, searchParams]
	)

	const updateUrl = useCallback(
		(params: Partial<UrlParamsConfig>) => {
			const newParams = new URLSearchParams(searchParams.toString())

			if (params.page !== undefined) {
				if (params.page === 1) {
					newParams.delete('page')
				} else {
					newParams.set('page', params.page.toString())
				}
			}

			if (params.pageSize !== undefined) {
				if (params.pageSize === 10) {
					newParams.delete('pageSize')
				} else {
					newParams.set('pageSize', params.pageSize.toString())
				}
			}

			if (params.search !== undefined) {
				if (params.search) {
					newParams.set('search', params.search)
				} else {
					newParams.delete('search')
				}
			}

			if (params.statuses !== undefined) {
				if (params.statuses.length > 0) {
					newParams.set('status', params.statuses.join(','))
				} else {
					newParams.delete('status')
				}
			}

			if (params.tags !== undefined) {
				if (params.tags.length > 0) {
					newParams.set('tag', params.tags.join(','))
				} else {
					newParams.delete('tag')
				}
			}

			if (params.datePreset !== undefined) {
				if (params.datePreset) {
					newParams.set('datePreset', params.datePreset)
				} else {
					newParams.delete('datePreset')
				}
			}

			if (params.createdFrom !== undefined) {
				if (params.createdFrom) {
					newParams.set('createdFrom', params.createdFrom)
				} else {
					newParams.delete('createdFrom')
				}
			}

			if (params.createdTo !== undefined) {
				if (params.createdTo) {
					newParams.set('createdTo', params.createdTo)
				} else {
					newParams.delete('createdTo')
				}
			}

			if (params.sort !== undefined) {
				if (params.sort.field !== 'created_date') {
					newParams.set('sort', params.sort.field)
				} else {
					newParams.delete('sort')
				}
				if (params.sort.order !== 'desc') {
					newParams.set('order', params.sort.order)
				} else {
					newParams.delete('order')
				}
			}

			const queryString = newParams.toString()
			router.push(queryString ? `?${queryString}` : '/links', {
				scroll: false
			})
		},
		[router, searchParams]
	)

	const clearAllParams = useCallback(() => {
		router.push('/links', { scroll: false })
	}, [router])

	return {
		getInitialPage,
		getInitialPageSize,
		getInitialSearch,
		getInitialFilters,
		updateUrl,
		clearAllParams
	}
}
