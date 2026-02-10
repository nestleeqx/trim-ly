import Toast from '@/app/components/ui/Toast/Toast'
import ConfirmModal from '@/app/features/links/components/ConfirmModal/ConfirmModal'
import QrCodeModal from '@/app/features/links/components/QrCodeModal/QrCodeModal'
import { ToastState } from '@/hooks/useToast'
import { LinkItem, ModalConfig } from '@/types/links'

interface LinkModalsProps {
	showQrModal: boolean
	link: LinkItem | undefined
	onQrClose: () => void
	onQrCopy: () => void
	onQrDownload: () => void

	confirmModalOpen: boolean
	confirmModalConfig: ModalConfig
	confirmLoading: boolean
	onConfirmClose: () => void
	onConfirm: () => void

	unsavedModalOpen: boolean
	onStayOnPage: () => void
	onLeaveWithoutSaving: () => void

	toast: ToastState
	onToastClose: () => void
}

export default function LinkModals({
	showQrModal,
	link,
	onQrClose,
	onQrCopy,
	onQrDownload,
	confirmModalOpen,
	confirmModalConfig,
	confirmLoading,
	onConfirmClose,
	onConfirm,
	unsavedModalOpen,
	onStayOnPage,
	onLeaveWithoutSaving,
	toast,
	onToastClose
}: LinkModalsProps) {
	return (
		<>
			{showQrModal && link && (
				<QrCodeModal
					link={link}
					onClose={onQrClose}
					onCopyUrl={onQrCopy}
					onDownload={onQrDownload}
				/>
			)}

			<ConfirmModal
				isOpen={confirmModalOpen}
				onClose={onConfirmClose}
				onConfirm={onConfirm}
				title={confirmModalConfig.title}
				message={confirmModalConfig.message}
				confirmText={confirmModalConfig.confirmText}
				variant={confirmModalConfig.variant}
				loading={confirmLoading}
			/>

			<ConfirmModal
				isOpen={unsavedModalOpen}
				onClose={onStayOnPage}
				onConfirm={onLeaveWithoutSaving}
				title='Несохранённые изменения'
				message='У вас есть несохранённые изменения. Вы уверены, что хотите уйти без сохранения?'
				confirmText='Уйти без сохранения'
				cancelText='Остаться'
				variant='warning'
			/>

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={onToastClose}
				variant={toast.variant}
			/>
		</>
	)
}
