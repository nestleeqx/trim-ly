import { ToastVariant } from '@/app/components/ui/Toast/Toast'
import useCsvExport from '@/hooks/useCsvExport'
import { LinkItem, LinksFiltersState } from '@/types/links'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLinksFiltering } from './links/useLinksFiltering'
import { useLinksOperations } from './links/useLinksOperations'
import { useLinksSelection } from './links/useLinksSelection'
import { useUrlParamsSync } from './links/useUrlParamsSync'

export const useLinksManager = (initialLinks: LinkItem[]) => {
	const {
		getInitialPage,
		getInitialPageSize,
		getInitialSearch,
		getInitialFilters,
		updateUrl,
		clearAllParams
	} = useUrlParamsSync()

	const [links, setLinks] = useState<LinkItem[]>(initialLinks)
	const [currentPage, setCurrentPage] = useState(getInitialPage)
	const [itemsPerPage, setItemsPerPage] = useState(getInitialPageSize)
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
	const [searchQuery, setSearchQuery] = useState(getInitialSearch)
	const [appliedSearch, setAppliedSearch] = useState(getInitialSearch)
	const [filters, setFilters] = useState<LinksFiltersState>(getInitialFilters)
	const [exportLoading, setExportLoading] = useState(false)

	const [toast, setToast] = useState<{
		isVisible: boolean
		message: string
		variant: ToastVariant
	}>({ isVisible: false, message: '', variant: 'success' })

	useEffect(() => {
		setLinks(initialLinks)
	}, [initialLinks])

	const { downloadCsv } = useCsvExport()

	const showToast = useCallback(
		(message: string, variant: ToastVariant = 'success') => {
			setToast({ isVisible: true, message, variant })
		},
		[]
	)

	const hideToast = useCallback(() => {
		setToast(prev => ({ ...prev, isVisible: false }))
	}, [])

	const { filteredAndSortedLinks, hasActiveFilters } = useLinksFiltering(
		links,
		appliedSearch,
		filters
	)

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

	const {
		selectedLinks,
		setSelectedLinks,
		handleSelectAll,
		handleSelectLink,
		handleClearSelection
	} = useLinksSelection(paginatedLinks)

	const {
		confirmModal,
		actionLoading,
		handleCopyLink,
		handleDeleteItem,
		handlePauseItem,
		handleResumeItem,
		handleBulkPause,
		handleBulkResume,
		handleBulkDelete,
		handleCloseModal,
		handleConfirmAction
	} = useLinksOperations({
		links,
		setLinks,
		selectedLinks,
		clearSelection: () => setSelectedLinks([]),
		showToast
	})

	const handleSearch = useCallback(
		(value: string) => {
			setAppliedSearch(value)
			setCurrentPage(1)
			updateUrl({ search: value, page: 1 })
		},
		[updateUrl]
	)

	const handlePageChange = useCallback(
		(page: number) => {
			setCurrentPage(page)
			updateUrl({ page })
		},
		[updateUrl]
	)

	const handleItemsPerPageChange = useCallback(
		(count: number) => {
			setItemsPerPage(count)
			setCurrentPage(1)
			updateUrl({ pageSize: count, page: 1 })
		},
		[updateUrl]
	)

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
		clearAllParams()
	}, [clearAllParams])

	const handleExport = useCallback(async () => {
		setExportLoading(true)

		try {
			await new Promise(resolve => setTimeout(resolve, 500))

			downloadCsv(filteredAndSortedLinks, {
				filename: `shortlinks_export_${new Date().toISOString().slice(0, 10)}.csv`,
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
	}, [filteredAndSortedLinks, downloadCsv, showToast])

	return {
		state: {
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
			hasActiveFilters,
			filteredAndSortedLinks
		},

		ui: {
			exportLoading,
			confirmModal,
			actionLoading,
			toast
		},

		handlers: {
			setSearchQuery,
			setViewMode,
			handleSearch,

			handleSelectAll,
			handleSelectLink,
			handleClearSelection,

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
			hideToast,
			handleExport
		}
	}
}
