'use client'

import {
	deleteLink,
	getLinks,
	patchLinkStatus
} from '@/app/features/links/api/linksApi'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
import { useToast } from '@/hooks/useToast'
import { LinkItem } from '@/types/links'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	RECENT_LINKS_CONFIRM_CONTENT,
	type RecentLinksConfirmAction
} from './recentLinksConfirmContent'

export interface RecentLinksProps {
	links?: LinkItem[]
	isLoading?: boolean
	isEmpty?: boolean
	limit?: number
}

interface ConfirmModalState {
	isOpen: boolean
	action: RecentLinksConfirmAction | null
	linkId: string | null
	linkTitle: string
}

const DEFAULT_LINK_TITLE = 'Без названия'
const DEFAULT_FETCH_ERROR = 'Не удалось загрузить последние ссылки.'

const initialConfirmModalState: ConfirmModalState = {
	isOpen: false,
	action: null,
	linkId: null,
	linkTitle: ''
}

export default function useRecentLinksController({
	links: externalLinks,
	isLoading = false,
	isEmpty = false,
	limit = 5
}: RecentLinksProps) {
	const router = useRouter()
	const pathname = usePathname()
	const { toast, showToast, hideToast } = useToast()

	const [fetchedLinks, setFetchedLinks] = useState<LinkItem[]>([])
	const [isFetching, setIsFetching] = useState(!externalLinks)
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false)
	const [fetchError, setFetchError] = useState<string | null>(null)
	const [reloadKey, setReloadKey] = useState(0)
	const [confirmModal, setConfirmModal] = useState(initialConfirmModalState)
	const [actionLoading, setActionLoading] = useState(false)

	const loadRecentLinks = useCallback(
		async (signal?: AbortSignal) => {
			setIsFetching(true)
			setFetchError(null)
			try {
				const response = await getLinks({
					page: 1,
					pageSize: limit,
					sort: 'created_date',
					order: 'desc',
					signal
				})
				setFetchedLinks(response.links.map(mapLinkDtoToItem))
			} catch (error) {
				if (
					error instanceof DOMException &&
					error.name === 'AbortError'
				)
					return
				setFetchError(
					error instanceof Error ? error.message : DEFAULT_FETCH_ERROR
				)
			} finally {
				if (signal?.aborted) return
				setHasFetchedOnce(true)
				setIsFetching(false)
			}
		},
		[limit]
	)

	useEffect(() => {
		if (externalLinks || pathname !== '/dashboard') return
		setHasFetchedOnce(false)
		setIsFetching(true)
		const controller = new AbortController()
		void loadRecentLinks(controller.signal)
		return () => controller.abort()
	}, [externalLinks, loadRecentLinks, reloadKey, pathname])

	const links = useMemo(
		() => (externalLinks ?? fetchedLinks).slice(0, limit),
		[externalLinks, fetchedLinks, limit]
	)
	const resolvedLoading = externalLinks
		? isLoading
		: isFetching || !hasFetchedOnce
	const resolvedEmpty =
		isEmpty || (!resolvedLoading && hasFetchedOnce && links.length === 0)

	const getLinkTitle = useCallback(
		(id: string) => links.find(link => link.id === id)?.title || DEFAULT_LINK_TITLE,
		[links]
	)

	const openConfirm = useCallback(
		(action: RecentLinksConfirmAction, id: string) => {
			setConfirmModal({
				isOpen: true,
				action,
				linkId: id,
				linkTitle: getLinkTitle(id)
			})
		},
		[getLinkTitle]
	)

	const closeConfirmModal = useCallback(() => {
		if (actionLoading) return
		setConfirmModal(initialConfirmModalState)
	}, [actionLoading])

	const handleConfirmAction = useCallback(async () => {
		if (!confirmModal.linkId || !confirmModal.action) return

		setActionLoading(true)
		try {
			if (confirmModal.action === 'delete') {
				await deleteLink(confirmModal.linkId)
			} else {
				await patchLinkStatus(confirmModal.linkId, confirmModal.action)
			}

			showToast(RECENT_LINKS_CONFIRM_CONTENT[confirmModal.action].successToast)
			if (!externalLinks) setReloadKey(prev => prev + 1)
			closeConfirmModal()
		} catch (error) {
			showToast(
				error instanceof Error ? error.message : 'Ошибка операции',
				'error'
			)
		} finally {
			setActionLoading(false)
		}
	}, [confirmModal, externalLinks, showToast, closeConfirmModal])

	return {
		toast,
		hideToast,
		links,
		limit,
		fetchError,
		resolvedLoading,
		resolvedEmpty,
		confirmModal,
		actionLoading,
		confirmContent: confirmModal.action
			? RECENT_LINKS_CONFIRM_CONTENT[confirmModal.action]
			: null,
		handleRetry: () => {
			if (!externalLinks) setReloadKey(prev => prev + 1)
		},
		handleCopy: () => showToast('Ссылка скопирована'),
		handleEdit: (id: string) => router.push(`/links/${id}`),
		openConfirm,
		closeConfirmModal,
		handleConfirmAction
	}
}
