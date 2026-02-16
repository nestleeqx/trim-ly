import { ToastVariant } from '@/app/components/ui/Toast/Toast'
import { LinkItem, LinksFiltersState } from '@/types/links'
import { convertLinksToCsv } from '@/utils/csvConverters'
import { downloadCsv } from '@/utils/downloadCsv'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLinksOperations } from './useLinksOperations'
import { useLinksSelection } from './useLinksSelection'
import { useUrlParamsSync } from './useUrlParamsSync'

type ServerMeta = {
	totalFiltered: number
}

export const useLinksManager = (
	initialLinks: LinkItem[],
	serverMeta?: ServerMeta,
	onOperationsSuccess?: () => void
) => {
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

	const showToast = useCallback(
		(message: string, variant: ToastVariant = 'success') => {
			setToast({ isVisible: true, message, variant })
		},
		[]
	)

	const hideToast = useCallback(() => {
		setToast(prev => ({ ...prev, isVisible: false }))
	}, [])

	const hasActiveFilters = useMemo(
		() =>
			appliedSearch.trim() !== '' ||
			filters.statuses.length > 0 ||
			filters.tags.length > 0 ||
			filters.datePreset !== null ||
			!!filters.createdFrom ||
			!!filters.createdTo,
		[
			appliedSearch,
			filters.statuses,
			filters.tags,
			filters.datePreset,
			filters.createdFrom,
			filters.createdTo
		]
	)

	const filteredAndSortedLinks = links
	const totalItems = serverMeta?.totalFiltered ?? links.length
	const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages)
			updateUrl({ page: totalPages })
		}
	}, [currentPage, totalPages, updateUrl])

	const paginatedLinks = links

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
		handleRestoreItem,
		handleBulkPause,
		handleBulkResume,
		handleBulkRestore,
		handleBulkDelete,
		handleCloseModal,
		handleConfirmAction
	} = useLinksOperations({
		links,
		setLinks,
		selectedLinks,
		clearSelection: () => setSelectedLinks([]),
		showToast,
		onSuccess: onOperationsSuccess
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
			const safePage = Math.min(Math.max(page, 1), totalPages)
			setCurrentPage(safePage)
			updateUrl({ page: safePage })
		},
		[totalPages, updateUrl]
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
				datePreset: newFilters.datePreset || null,
				createdFrom: newFilters.createdFrom || null,
				createdTo: newFilters.createdTo || null,
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
			createdFrom: null,
			createdTo: null,
			sort: { field: 'created_date', order: 'desc' }
		})
		setCurrentPage(1)
		clearAllParams()
	}, [clearAllParams])

	const handleExport = useCallback(async () => {
		setExportLoading(true)

		try {
			await new Promise(resolve => setTimeout(resolve, 500))

			downloadCsv({
				data: filteredAndSortedLinks,
				filename: `shortlinks_export_${new Date().toISOString().slice(0, 10)}.csv`,
				converter: convertLinksToCsv
			})

			showToast(`Экспортировано ${filteredAndSortedLinks.length} ссылок`, 'success')
		} catch {
			showToast('Ошибка при экспорте', 'error')
		} finally {
			setExportLoading(false)
		}
	}, [filteredAndSortedLinks, showToast])

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
			handleRestoreItem,

			handleBulkPause,
			handleBulkResume,
			handleBulkRestore,
			handleBulkDelete,

			handleCloseModal,
			handleConfirmAction,
			hideToast,
			handleExport
		}
	}
}
