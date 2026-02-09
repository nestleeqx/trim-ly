'use client'

import { LinkModals } from '@/app/components/ui/LinkModals'
import { ToastState } from '@/hooks/useToast'
import { getModalConfig, LinkItem } from '@/types/links'
import React from 'react'

interface LinkDetailsModalsProps {
	link: LinkItem | undefined
	showQrModal: boolean
	onQrClose: () => void
	onQrCopy: () => void
	onQrDownload: () => void
	confirmModal: {
		isOpen: boolean
		action: string | null
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

export const LinkDetailsModals: React.FC<LinkDetailsModalsProps> = ({
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
}) => {
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
