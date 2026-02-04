import { ToastVariant } from '@/app/components/ui/Toast/Toast'
import useCsvExport from '@/hooks/useCsvExport'
import {
	ConfirmModalState,
	LinkItem,
	LinksFiltersState,
	SortField,
	VALID_PAGE_SIZES,
	VALID_SORT_FIELDS,
	VALID_STATUSES
} from '@/types/links'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const useLinksManager = (initialLinks: LinkItem[]) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const getInitialPage = () => {
		const page = parseInt(searchParams.get('page') || '1', 10)
		return page > 0 ? page : 1
	}

	const getInitialPageSize = () => {
		const size = parseInt(searchParams.get('pageSize') || '10', 10)
		return VALID_PAGE_SIZES.includes(
			size as (typeof VALID_PAGE_SIZES)[number]
		)
			? size
			: 10
	}

	const getInitialSearch = () => searchParams.get('search') || ''

	const getInitialStatuses = () => {
		const statuses = searchParams.get('status')
		if (!statuses) return []
		return statuses
			.split(',')
			.filter(s =>
				VALID_STATUSES.includes(s as (typeof VALID_STATUSES)[number])
			)
	}

	const getInitialTags = () => {
		const tags = searchParams.get('tag')
		return tags ? tags.split(',') : []
	}

	const getInitialSort = () => {
		const sortParam = searchParams.get('sort') || 'created_date'
		const orderParam = searchParams.get('order') || 'desc'
		const field = VALID_SORT_FIELDS.includes(sortParam as SortField)
			? (sortParam as SortField)
			: 'created_date'
		const order = orderParam === 'asc' ? 'asc' : 'desc'
		return { field, order: order as 'asc' | 'desc' }
	}

	const [links, setLinks] = useState<LinkItem[]>(initialLinks)
	const [selectedLinks, setSelectedLinks] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(getInitialPage)
	const [itemsPerPage, setItemsPerPage] = useState(getInitialPageSize)
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
	const [searchQuery, setSearchQuery] = useState(getInitialSearch)
	const [appliedSearch, setAppliedSearch] = useState(getInitialSearch)
	const [filters, setFilters] = useState<LinksFiltersState>({
		statuses: getInitialStatuses(),
		tags: getInitialTags(),
		datePreset: null,
		sort: getInitialSort()
	})
	const [exportLoading, setExportLoading] = useState(false)

	const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
		isOpen: false,
		action: null
	})
	const [actionLoading, setActionLoading] = useState(false)
	const [toast, setToast] = useState<{
		isVisible: boolean
		message: string
		variant: ToastVariant
	}>({ isVisible: false, message: '', variant: 'success' })

	const { downloadCsv } = useCsvExport()

	const updateUrl = useCallback(
		(params: {
			page?: number
			pageSize?: number
			search?: string
			statuses?: string[]
			tags?: string[]
			sort?: { field: string; order: string }
		}) => {
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
			router.push(queryString ? `?${queryString}` : '/dashboard/links', {
				scroll: false
			})
		},
		[router, searchParams]
	)

	const showToast = useCallback(
		(message: string, variant: ToastVariant = 'success') => {
			setToast({ isVisible: true, message, variant })
		},
		[]
	)

	const hideToast = useCallback(() => {
		setToast(prev => ({ ...prev, isVisible: false }))
	}, [])

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

		const sortLinks = (
			linksToSort: LinkItem[],
			sortConfig: typeof filters.sort
		) => {
			return [...linksToSort].sort((a, b) => {
				const order = sortConfig.order === 'asc' ? 1 : -1

				switch (sortConfig.field) {
					case 'created_date':
						return (
							(new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime()) *
							order
						)

					case 'clicks':
						return (b.clicks - a.clicks) * order

					case 'title':
						return a.title.localeCompare(b.title, 'ru') * order

					case 'status':
						const statusOrder = {
							active: 0,
							paused: 1,
							expired: 2,
							deleted: 3
						}
						return (
							(statusOrder[a.status] - statusOrder[b.status]) *
							order
						)

					case 'expiration_date':
						const dateA = a.expirationDate
							? new Date(a.expirationDate).getTime()
							: 0
						const dateB = b.expirationDate
							? new Date(b.expirationDate).getTime()
							: 0
						return (dateB - dateA) * order

					default:
						return 0
				}
			})
		}

		return sortLinks(filtered, filters.sort)
	}, [links, appliedSearch, filters])

	const totalItems = filteredAndSortedLinks.length
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(1)
			updateUrl({ page: 1 })
		}
	}, [currentPage, totalPages, updateUrl])

	const paginatedLinks = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage
		return filteredAndSortedLinks.slice(
			startIndex,
			startIndex + itemsPerPage
		)
	}, [filteredAndSortedLinks, currentPage, itemsPerPage])

	const handleSelectAll = (checked: boolean) => {
		setSelectedLinks(checked ? paginatedLinks.map(link => link.id) : [])
	}

	const handleSelectLink = (id: string, checked: boolean) => {
		setSelectedLinks(prev =>
			checked ? [...prev, id] : prev.filter(linkId => linkId !== id)
		)
	}

	const handleClearSelection = () => {
		setSelectedLinks([])
	}

	const handleSearch = (value: string) => {
		setAppliedSearch(value)
		setCurrentPage(1)
		updateUrl({ search: value, page: 1 })
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		updateUrl({ page })
	}

	const handleItemsPerPageChange = (count: number) => {
		setItemsPerPage(count)
		setCurrentPage(1)
		updateUrl({ pageSize: count, page: 1 })
	}

	const handleFiltersChange = useCallback(
		(newFilters: LinksFiltersState) => {
			setFilters(newFilters)
			setCurrentPage(1)
			updateUrl({
				statuses: newFilters.statuses,
				tags: newFilters.tags,
				sort: newFilters.sort,
				page: 1
			})
		},
		[updateUrl]
	)

	const hasActiveFilters = useMemo(() => {
		return (
			appliedSearch.trim() !== '' ||
			filters.statuses.length > 0 ||
			filters.tags.length > 0 ||
			filters.datePreset !== null
		)
	}, [appliedSearch, filters.statuses, filters.tags, filters.datePreset])

	const handleClearFilters = useCallback(() => {
		setSearchQuery('')
		setAppliedSearch('')
		setFilters({
			statuses: [],
			tags: [],
			datePreset: null,
			sort: { field: 'created_date', order: 'desc' }
		})
		setCurrentPage(1)
		router.push('/dashboard/links', { scroll: false })
	}, [router])

	const handleCopyLink = useCallback(
		(shortUrl: string) => {
			showToast(`Ссылка ${shortUrl} скопирована`, 'success')
		},
		[showToast]
	)

	const handleDeleteItem = useCallback(
		(id: string) => {
			const link = links.find(l => l.id === id)
			setConfirmModal({
				isOpen: true,
				action: 'delete-single',
				itemId: id,
				itemTitle: link?.title || ''
			})
		},
		[links]
	)

	const handlePauseItem = useCallback(
		(id: string) => {
			const link = links.find(l => l.id === id)
			setConfirmModal({
				isOpen: true,
				action: 'pause-single',
				itemId: id,
				itemTitle: link?.title || ''
			})
		},
		[links]
	)

	const handleResumeItem = useCallback(
		(id: string) => {
			const link = links.find(l => l.id === id)
			setConfirmModal({
				isOpen: true,
				action: 'resume-single',
				itemId: id,
				itemTitle: link?.title || ''
			})
		},
		[links]
	)

	const handleBulkPause = () => {
		setConfirmModal({ isOpen: true, action: 'pause' })
	}

	const handleBulkResume = () => {
		setConfirmModal({ isOpen: true, action: 'resume' })
	}

	const handleBulkDelete = () => {
		setConfirmModal({ isOpen: true, action: 'delete' })
	}

	const handleCloseModal = () => {
		setConfirmModal({ isOpen: false, action: null })
	}

	const handleConfirmAction = async () => {
		setActionLoading(true)

		try {
			await new Promise(resolve => setTimeout(resolve, 500))

			switch (confirmModal.action) {
				case 'pause':
					setLinks(prev =>
						prev.map(link =>
							selectedLinks.includes(link.id)
								? { ...link, status: 'paused' as const }
								: link
						)
					)
					showToast(
						`Приостановлено ссылок: ${selectedLinks.length}`,
						'success'
					)
					setSelectedLinks([])
					break

				case 'resume':
					setLinks(prev =>
						prev.map(link =>
							selectedLinks.includes(link.id)
								? { ...link, status: 'active' as const }
								: link
						)
					)
					showToast(
						`Возобновлено ссылок: ${selectedLinks.length}`,
						'success'
					)
					setSelectedLinks([])
					break

				case 'delete':
					setLinks(prev =>
						prev.filter(link => !selectedLinks.includes(link.id))
					)
					showToast(
						`Удалено ссылок: ${selectedLinks.length}`,
						'success'
					)
					setSelectedLinks([])
					break

				case 'delete-single':
					if (confirmModal.itemId) {
						setLinks(prev =>
							prev.filter(link => link.id !== confirmModal.itemId)
						)
						showToast('Ссылка удалена', 'success')
					}
					break

				case 'pause-single':
					if (confirmModal.itemId) {
						setLinks(prev =>
							prev.map(link =>
								link.id === confirmModal.itemId
									? { ...link, status: 'paused' as const }
									: link
							)
						)
						showToast('Ссылка приостановлена', 'success')
					}
					break

				case 'resume-single':
					if (confirmModal.itemId) {
						setLinks(prev =>
							prev.map(link =>
								link.id === confirmModal.itemId
									? { ...link, status: 'active' as const }
									: link
							)
						)
						showToast('Ссылка возобновлена', 'success')
					}
					break
			}

			handleCloseModal()
		} catch {
			showToast('Произошла ошибка. Попробуйте ещё раз.', 'error')
		} finally {
			setActionLoading(false)
		}
	}

	const handleExport = async () => {
		setExportLoading(true)

		try {
			await new Promise(resolve => setTimeout(resolve, 500))

			downloadCsv(filteredAndSortedLinks, {
				filename: `shortlinks_export_${new Date()
					.toISOString()
					.slice(0, 10)}.csv`,
				includeHeaders: true
			})

			showToast(
				`Экспортировано ${filteredAndSortedLinks.length} ссылок`,
				'success'
			)
		} catch {
			showToast('Ошибка при экспорте', 'error')
		} finally {
			setExportLoading(false)
		}
	}

	return {
		links,
		paginatedLinks,
		selectedLinks,
		currentPage,
		totalPages,
		totalItems,
		itemsPerPage,
		viewMode,
		searchQuery,
		appliedSearch,
		filters,
		exportLoading,
		confirmModal,
		actionLoading,
		toast,
		filteredAndSortedLinks,
		hasActiveFilters,

		setSearchQuery,
		setViewMode,
		handleSelectAll,
		handleSelectLink,
		handleClearSelection,
		handleSearch,
		handlePageChange,
		handleItemsPerPageChange,
		handleFiltersChange,
		handleClearFilters,
		handleCopyLink,
		handleDeleteItem,
		handlePauseItem,
		handleResumeItem,
		handleBulkPause,
		handleBulkResume,
		handleBulkDelete,
		handleCloseModal,
		handleConfirmAction,
		handleExport,
		hideToast
	}
}
