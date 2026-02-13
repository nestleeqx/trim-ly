import {
	bulkLinkAction,
	deleteLink,
	mapCreateLinkError,
	patchLinkStatus
} from '@/app/features/links/api/linksApi'
import { ToastVariant } from '@/app/components/ui/Toast/Toast'
import { ConfirmModalState, LinkItem } from '@/types/links'
import { useCallback, useState } from 'react'

interface UseLinksOperationsProps {
	links: LinkItem[]
	setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>
	selectedLinks: string[]
	clearSelection: () => void
	showToast: (message: string, variant?: ToastVariant) => void
	onSuccess?: () => void
}

export const useLinksOperations = ({
	links,
	setLinks,
	selectedLinks,
	clearSelection,
	showToast,
	onSuccess
}: UseLinksOperationsProps) => {
	const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
		isOpen: false,
		action: null
	})
	const [actionLoading, setActionLoading] = useState(false)

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

	const handleRestoreItem = useCallback(
		(id: string) => {
			const link = links.find(l => l.id === id)
			setConfirmModal({
				isOpen: true,
				action: 'restore-single',
				itemId: id,
				itemTitle: link?.title || ''
			})
		},
		[links]
	)

	const handleBulkPause = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'pause' })
	}, [])

	const handleBulkResume = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'resume' })
	}, [])

	const handleBulkRestore = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'restore' })
	}, [])

	const handleBulkDelete = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'delete' })
	}, [])

	const handleCloseModal = useCallback(() => {
		setConfirmModal({ isOpen: false, action: null })
	}, [])

	const handleConfirmAction = useCallback(async () => {
		setActionLoading(true)

		try {
			switch (confirmModal.action) {
				case 'pause':
					await bulkLinkAction(selectedLinks, 'pause')
					setLinks(prev =>
						prev.map(link =>
							selectedLinks.includes(link.id)
								? { ...link, status: 'paused' as const }
								: link
						)
					)
					showToast(`Приостановлено ссылок: ${selectedLinks.length}`, 'success')
					clearSelection()
					break

				case 'resume':
					await bulkLinkAction(selectedLinks, 'resume')
					setLinks(prev =>
						prev.map(link =>
							selectedLinks.includes(link.id)
								? { ...link, status: 'active' as const }
								: link
						)
					)
					showToast(`Возобновлено ссылок: ${selectedLinks.length}`, 'success')
					clearSelection()
					break

				case 'restore':
					await bulkLinkAction(selectedLinks, 'restore')
					setLinks(prev =>
						prev.map(link =>
							selectedLinks.includes(link.id)
								? { ...link, status: 'active' as const }
								: link
						)
					)
					showToast(`Восстановлено ссылок: ${selectedLinks.length}`, 'success')
					clearSelection()
					break

				case 'delete':
					await bulkLinkAction(selectedLinks, 'delete')
					setLinks(prev =>
						prev.filter(link => !selectedLinks.includes(link.id))
					)
					showToast(`Удалено ссылок: ${selectedLinks.length}`, 'success')
					clearSelection()
					break

				case 'delete-single':
					if (confirmModal.itemId) {
						await deleteLink(confirmModal.itemId)
						setLinks(prev =>
							prev.filter(link => link.id !== confirmModal.itemId)
						)
						showToast('Ссылка удалена', 'success')
					}
					break

				case 'pause-single':
					if (confirmModal.itemId) {
						await patchLinkStatus(confirmModal.itemId, 'pause')
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
						await patchLinkStatus(confirmModal.itemId, 'resume')
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

				case 'restore-single':
					if (confirmModal.itemId) {
						await patchLinkStatus(confirmModal.itemId, 'restore')
						setLinks(prev =>
							prev.map(link =>
								link.id === confirmModal.itemId
									? { ...link, status: 'active' as const }
									: link
							)
						)
						showToast('Ссылка восстановлена', 'success')
					}
					break
			}

			onSuccess?.()
			handleCloseModal()
		} catch (error) {
			const message =
				error instanceof Error
					? mapCreateLinkError(error.message)
					: 'Произошла ошибка. Попробуйте еще раз.'
			showToast(message, 'error')
		} finally {
			setActionLoading(false)
		}
	}, [
		confirmModal.action,
		confirmModal.itemId,
		selectedLinks,
		setLinks,
		clearSelection,
		showToast,
		handleCloseModal,
		onSuccess
	])

	return {
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
	}
}
