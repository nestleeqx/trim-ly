import { getLinks, mapCreateLinkError } from '@/app/features/links/api/linksApi'
import { getTags } from '@/app/features/links/api/tagsApi'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
import { useLinksManager } from '@/hooks/useLinksManager'
import { LinkItem } from '@/types/links'
import {
	calculateBulkCapabilities,
	getConfirmModalConfig,
	getEmptyStateData,
	getResultsInfo,
	getSelectedLinkItems
} from '@/utils/link-helpers'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function useLinksPageController() {
	const [loadedLinks, setLoadedLinks] = useState<LinkItem[]>([])
	const [availableTags, setAvailableTags] = useState<string[]>([])
	const [totalAllLinks, setTotalAllLinks] = useState(0)
	const [totalFilteredLinks, setTotalFilteredLinks] = useState(0)
	const [isLoadingLinks, setIsLoadingLinks] = useState(true)
	const [isLoadingTags, setIsLoadingTags] = useState(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
	const [showRefetchLoader, setShowRefetchLoader] = useState(false)
	const hasLoadedOnceRef = useRef(false)
	const [filtersUiKey, setFiltersUiKey] = useState(0)
	const [reloadKey, setReloadKey] = useState(0)

	const handleOperationsSuccess = useCallback(
		() => setReloadKey(prev => prev + 1),
		[]
	)

	const manager = useLinksManager(
		loadedLinks,
		{ totalFiltered: totalFilteredLinks },
		handleOperationsSuccess
	)
	const { state, ui, handlers } = manager

	const tagsQueryKey = state.filters.tags.slice().sort().join('|')
	const statusQueryKey = state.filters.statuses.slice().sort().join('|')
	const tagsForQuery = useMemo(
		() => (tagsQueryKey ? tagsQueryKey.split('|') : []),
		[tagsQueryKey]
	)

	useEffect(() => {
		let active = true

		const loadTags = async () => {
			setIsLoadingTags(true)
			try {
				const tags = await getTags()
				if (!active) return
				setAvailableTags(tags.map(tag => tag.name))
			} catch {
				if (!active) return
				setAvailableTags([])
			} finally {
				if (active) setIsLoadingTags(false)
			}
		}

		void loadTags()
		return () => {
			active = false
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		let active = true

		const loadLinks = async () => {
			setIsLoadingLinks(true)
			setLoadError(null)

			try {
				const items = await getLinks({
					search: state.appliedSearch,
					page: state.currentPage,
					pageSize: state.itemsPerPage,
					sort: state.filters.sort.field,
					order: state.filters.sort.order,
					tags: tagsForQuery,
					statuses: state.filters.statuses,
					datePreset: state.filters.datePreset,
					createdFrom: state.filters.createdFrom || null,
					createdTo: state.filters.createdTo || null,
					signal: controller.signal
				})

				if (!active) return

				setLoadedLinks(items.links.map(mapLinkDtoToItem))
				setTotalAllLinks(items.meta.totalAll)
				setTotalFilteredLinks(items.meta.totalFiltered)
				hasLoadedOnceRef.current = true
				setHasLoadedOnce(true)
			} catch (error) {
				const isAbort =
					(error instanceof DOMException &&
						error.name === 'AbortError') ||
					(error instanceof Error && /aborted|abort/i.test(error.message))

				if (isAbort || !active) return

				setLoadError(
					error instanceof Error
						? mapCreateLinkError(error.message)
						: 'Не удалось загрузить ссылки.'
				)

				if (!hasLoadedOnceRef.current) {
					setLoadedLinks([])
					setTotalAllLinks(0)
					setTotalFilteredLinks(0)
				}
			} finally {
				if (active) setIsLoadingLinks(false)
			}
		}

		void loadLinks()
		return () => {
			active = false
			controller.abort()
		}
	}, [
		tagsQueryKey,
		tagsForQuery,
		statusQueryKey,
		state.filters.datePreset,
		state.filters.createdFrom,
		state.filters.createdTo,
		state.filters.sort.field,
		state.filters.sort.order,
		state.appliedSearch,
		state.currentPage,
		state.itemsPerPage,
		reloadKey
	])

	const selectedItems = getSelectedLinkItems(state.links, state.selectedLinks)
	const { canPauseBulk, canResumeBulk, canRestoreBulk, canDeleteBulk } =
		calculateBulkCapabilities(selectedItems)

	const emptyState = getEmptyStateData(totalAllLinks, state.totalItems)
	const resultsInfo = getResultsInfo(
		state.totalItems,
		state.selectedLinks.length,
		state.appliedSearch
	)

	const modalConfig = useMemo(
		() =>
			getConfirmModalConfig(
				ui.confirmModal.action as string,
				state.selectedLinks.length,
				ui.confirmModal.itemTitle
			),
		[ui.confirmModal.action, ui.confirmModal.itemTitle, state.selectedLinks.length]
	)

	const clearLoadError = useCallback(() => {
		setLoadError(null)
	}, [])

	const handleEmptyStateClearFilters = useCallback(() => {
		handlers.handleClearFilters()
		setFiltersUiKey(prev => prev + 1)
	}, [handlers])

	const isInitialLoading = isLoadingLinks && !hasLoadedOnce
	const isRefetchingRaw = isLoadingLinks && hasLoadedOnce

	useEffect(() => {
		if (!isRefetchingRaw) {
			setShowRefetchLoader(false)
			return
		}

		const t = setTimeout(() => {
			setShowRefetchLoader(true)
		}, 180)

		return () => {
			clearTimeout(t)
		}
	}, [isRefetchingRaw])

	const isRefetching = isRefetchingRaw && showRefetchLoader

	return {
		manager,
		availableTags,
		isInitialLoading,
		isRefetching,
		isLoadingTags,
		loadError,
		clearLoadError,
		filtersUiKey,
		canPauseBulk,
		canResumeBulk,
		canRestoreBulk,
		canDeleteBulk,
		emptyState,
		resultsInfo,
		modalConfig,
		handleEmptyStateClearFilters
	}
}
