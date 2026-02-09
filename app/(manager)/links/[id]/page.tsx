'use client'

import { LinkDetailsContent } from '@/app/components/dashboard/LinkDetails/LinkDetailsContent'
import { LinkDetailsHeader } from '@/app/components/dashboard/LinkDetails/LinkDetailsHeader'
import { LinkDetailsModals } from '@/app/components/dashboard/LinkDetails/LinkDetailsModals'
import LinkNotFound from '@/app/components/dashboard/LinkNotFound/LinkNotFound'
import DashboardHeader from '@/app/components/ui/DashboardHeader'
import { mockLinks } from '@/data/mockLinks'
import { useLinksOperations } from '@/hooks/links'
import { useLinkEdit } from '@/hooks/useLinkEdit'
import { useQrModal } from '@/hooks/useQrModal'
import { useToast } from '@/hooks/useToast'
import { LinkItem } from '@/types/links'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import styles from './page.module.scss'

export default function LinkDetailsPage() {
	const { id } = useParams<{ id: string }>()
	const router = useRouter()
	const linkId = id

	const [links, setLinks] = useState<LinkItem[]>(mockLinks)
	const link = useMemo(
		() => links.find(l => l.id === linkId),
		[links, linkId]
	)

	const { toast, showToast, hideToast } = useToast()

	const {
		confirmModal,
		actionLoading,
		handleDeleteItem,
		handlePauseItem,
		handleResumeItem,
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
			navigator.clipboard.writeText(`https://${url}`)
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

	if (!link) return <LinkNotFound />

	return (
		<>
			<DashboardHeader
				title='Детали ссылки'
				subtitle='Подробная информация о ссылке и её аналитика.'
				backHref='/links'
				showCreateButton={false}
			/>

			<div className={styles.content}>
				<LinkDetailsHeader
					link={link}
					linkId={linkId}
					currentTab={currentTab}
					safeNavigate={safeNavigate}
					handlePauseItem={handlePauseItem}
					handleResumeItem={handleResumeItem}
					handleDeleteItem={handleDeleteItem}
					setShowQrModal={setShowQrModal}
					handleCopy={handleCopy}
					hideEditButton={currentTab === 'edit'}
				/>

				<LinkDetailsContent
					currentTab={currentTab}
					link={link}
					linkId={linkId}
					editFormData={editFormData}
					saveLoading={saveLoading}
					onSave={handleSaveLink}
					onCancel={handleCancel}
					onChange={handleFormChange}
					onCopy={handlePreviewCopy}
					onDownloadQr={openQr}
				/>

				<LinkDetailsModals
					link={link}
					showQrModal={showQrModal}
					onQrClose={closeQr}
					onQrCopy={handleQrCopy}
					onQrDownload={handleQrDownload}
					confirmModal={confirmModal}
					actionLoading={actionLoading}
					onConfirmClose={handleCloseModal}
					onConfirm={handleConfirmAction}
					unsavedModal={unsavedModal}
					onStayOnPage={handleStayOnPage}
					onLeaveWithoutSaving={handleLeaveWithoutSaving}
					toast={toast}
					onToastClose={hideToast}
				/>
			</div>
		</>
	)
}
