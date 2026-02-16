'use client'

import LinkModals from '@/app/features/links/components/LinkDetails/LinkDetailsModals/LinkModals/LinkModals'
import { ToastState } from '@/hooks/useToast'
import { getModalConfig, LinkItem, ModalAction } from '@/types/links'

interface LinkDetailsModalsProps {
	link: LinkItem | undefined
	showQrModal: boolean
	onQrClose: () => void
	onQrCopy: () => void
	onQrDownload: () => void
	confirmModal: {
		isOpen: boolean
		action: ModalAction
	}
	actionLoading: boolean
	onConfirmClose: () => void
	onConfirm: () => Promise<void>
	unsavedModal: {
		isOpen: boolean
	}
	onStayOnPage: () => void
	onLeaveWithoutSaving: () => void
	toast: ToastState
	onToastClose: () => void
}

export default function LinkDetailsModals({
	link,
	showQrModal,
	onQrClose,
	onQrCopy,
	onQrDownload,
	confirmModal,
	actionLoading,
	onConfirmClose,
	onConfirm,
	unsavedModal,
	onStayOnPage,
	onLeaveWithoutSaving,
	toast,
	onToastClose
}: LinkDetailsModalsProps) {
	const modalConfig = getModalConfig(confirmModal.action, 1, link?.title)

	return (
		<LinkModals
			showQrModal={showQrModal}
			link={link}
			onQrClose={onQrClose}
			onQrCopy={onQrCopy}
			onQrDownload={onQrDownload}
			confirmModalOpen={confirmModal.isOpen}
			confirmModalConfig={modalConfig}
			confirmLoading={actionLoading}
			onConfirmClose={onConfirmClose}
			onConfirm={onConfirm}
			unsavedModalOpen={unsavedModal.isOpen}
			onStayOnPage={onStayOnPage}
			onLeaveWithoutSaving={onLeaveWithoutSaving}
			toast={toast}
			onToastClose={onToastClose}
		/>
	)
}
