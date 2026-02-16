'use client'

import Toast from '@/app/components/ui/Toast/Toast'
import type { useLinksManager } from '@/app/features/links/hooks/useLinksManager'
import ConfirmModal from '../ConfirmModal/ConfirmModal'

type LinksManagerVm = ReturnType<typeof useLinksManager>

interface LinksPageOverlaysProps {
	manager: LinksManagerVm
	loadError: string | null
	clearLoadError: () => void
	modalConfig: {
		title: string
		message: string
		confirmText: string
		variant: 'danger' | 'warning'
	}
}

export default function LinksPageOverlays({
	manager,
	loadError,
	clearLoadError,
	modalConfig
}: LinksPageOverlaysProps) {
	const { ui, handlers } = manager

	return (
		<>
			<ConfirmModal
				isOpen={ui.confirmModal.isOpen}
				onClose={handlers.handleCloseModal}
				onConfirm={handlers.handleConfirmAction}
				title={modalConfig.title}
				message={modalConfig.message}
				confirmText={modalConfig.confirmText}
				variant={modalConfig.variant}
				loading={ui.actionLoading}
			/>

			<Toast
				message={loadError || ui.toast.message}
				isVisible={Boolean(loadError) || ui.toast.isVisible}
				onClose={() => {
					clearLoadError()
					handlers.hideToast()
				}}
				variant={loadError ? 'error' : ui.toast.variant}
			/>
		</>
	)
}
