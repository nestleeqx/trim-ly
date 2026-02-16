'use client'

import { getLinkById } from '@/app/features/links/api/linksApi'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
import { toShortLinkHref } from '@/app/features/links/utils/shortLink'
import { useLinkEdit } from '@/app/features/links/hooks/useLinkEdit'
import { useQrModal } from '@/app/features/links/hooks/useQrModal'
import { useToast } from '@/hooks/useToast'
import { useLinksOperations } from '@/app/features/links/hooks/useLinksOperations'
import { LinkItem } from '@/types/links'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface UseLinkDetailsPageControllerResult {
	link: LinkItem | undefined
	linkId: string
	isLoading: boolean
	isNotFound: boolean
	currentTab: string
	editFormData: ReturnType<typeof useLinkEdit>['editFormData']
	saveLoading: boolean
	showQrModal: boolean
	setShowQrModal: (show: boolean) => void
	confirmModal: ReturnType<typeof useLinksOperations>['confirmModal']
	actionLoading: boolean
	unsavedModal: ReturnType<typeof useLinkEdit>['unsavedModal']
	toast: ReturnType<typeof useToast>['toast']
	handlePauseItem: ReturnType<typeof useLinksOperations>['handlePauseItem']
	handleResumeItem: ReturnType<typeof useLinksOperations>['handleResumeItem']
	handleRestoreItem: ReturnType<typeof useLinksOperations>['handleRestoreItem']
	handleDeleteItem: ReturnType<typeof useLinksOperations>['handleDeleteItem']
	handleCloseModal: ReturnType<typeof useLinksOperations>['handleCloseModal']
	handleConfirmAction: () => Promise<void>
	handleFormChange: ReturnType<typeof useLinkEdit>['handleFormChange']
	handleSaveLink: ReturnType<typeof useLinkEdit>['handleSaveLink']
	handlePreviewCopy: ReturnType<typeof useLinkEdit>['handlePreviewCopy']
	safeNavigate: ReturnType<typeof useLinkEdit>['safeNavigate']
	handleLeaveWithoutSaving: ReturnType<typeof useLinkEdit>['handleLeaveWithoutSaving']
	handleStayOnPage: ReturnType<typeof useLinkEdit>['handleStayOnPage']
	handleQrCopy: ReturnType<typeof useQrModal>['handleQrCopy']
	handleQrDownload: ReturnType<typeof useQrModal>['handleQrDownload']
	handleCopy: (url: string) => void
	handleCancel: () => void
	openQr: () => void
	closeQr: () => void
	hideToast: () => void
}

export function useLinkDetailsPageController(): UseLinkDetailsPageControllerResult {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const linkId = id

	const [links, setLinks] = useState<LinkItem[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const link = useMemo(
		() => links.find(item => item.id === linkId),
		[links, linkId]
	)

	useEffect(() => {
		if (!linkId) return

		const controller = new AbortController()
		let active = true

		const loadLink = async () => {
			setIsLoading(true)

			try {
				const response = await getLinkById(linkId, controller.signal)
				if (!active) return
				setLinks([mapLinkDtoToItem(response.link)])
			} catch (error) {
				if (
					error instanceof DOMException &&
					error.name === 'AbortError'
				) {
					return
				}
				if (!active) return
				setLinks([])
			} finally {
				if (active) setIsLoading(false)
			}
		}

		void loadLink()
		return () => {
			active = false
			controller.abort()
		}
	}, [linkId])

	const { toast, showToast, hideToast } = useToast()

	const {
		confirmModal,
		actionLoading,
		handleDeleteItem,
		handlePauseItem,
		handleResumeItem,
		handleRestoreItem,
		handleCloseModal,
		handleConfirmAction: baseConfirmAction
	} = useLinksOperations({
		links,
		setLinks,
		selectedLinks: [],
		clearSelection: () => {},
		showToast
	})

	const handleConfirmAction = useCallback(async () => {
		const willDelete = confirmModal.action === 'delete-single'
		await baseConfirmAction()
		if (willDelete) router.push('/links')
	}, [confirmModal.action, baseConfirmAction, router])

	const {
		currentTab,
		editFormData,
		saveLoading,
		unsavedModal,
		handleFormChange,
		handleSaveLink,
		handlePreviewCopy,
		safeNavigate,
		handleLeaveWithoutSaving,
		handleStayOnPage
	} = useLinkEdit({ link, linkId, setLinks, showToast })

	const { showQrModal, setShowQrModal, handleQrCopy, handleQrDownload } =
		useQrModal({ link, showToast })

	const handleCopy = useCallback(
		(url: string) => {
			navigator.clipboard.writeText(toShortLinkHref(url))
			showToast('Ссылка скопирована')
		},
		[showToast]
	)

	const handleCancel = useCallback(
		() => safeNavigate(`/links/${linkId}?tab=analytics`),
		[safeNavigate, linkId]
	)
	const openQr = useCallback(() => setShowQrModal(true), [setShowQrModal])
	const closeQr = useCallback(() => setShowQrModal(false), [setShowQrModal])

	return {
		link,
		linkId,
		isLoading,
		isNotFound: !link && !isLoading,
		currentTab,
		editFormData,
		saveLoading,
		showQrModal,
		setShowQrModal,
		confirmModal,
		actionLoading,
		unsavedModal,
		toast,
		handlePauseItem,
		handleResumeItem,
		handleRestoreItem,
		handleDeleteItem,
		handleCloseModal,
		handleConfirmAction,
		handleFormChange,
		handleSaveLink,
		handlePreviewCopy,
		safeNavigate,
		handleLeaveWithoutSaving,
		handleStayOnPage,
		handleQrCopy,
		handleQrDownload,
		handleCopy,
		handleCancel,
		openQr,
		closeQr,
		hideToast
	}
}

