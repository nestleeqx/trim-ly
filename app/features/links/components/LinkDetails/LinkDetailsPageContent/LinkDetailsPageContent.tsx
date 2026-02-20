'use client'

import LinkAnalyticsSkeleton from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkAnalyticsSkeleton/LinkAnalyticsSkeleton'
import LinkDetailsContent from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkDetailsContent'
import LinkEditViewSkeleton from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkEditView/LinkEditViewSkeleton/LinkEditViewSkeleton'
import LinkDetailsHeader from '@/app/features/links/components/LinkDetails/LinkDetailsHeader'
import LinkDetailsHeaderSkeleton from '@/app/features/links/components/LinkDetails/LinkDetailsHeaderSkeleton/LinkDetailsHeaderSkeleton'
import LinkDetailsModals from '@/app/features/links/components/LinkDetails/LinkDetailsModals/LinkDetailsModals'
import { UseLinkDetailsPageControllerResult } from '@/app/features/links/hooks/useLinkDetailsPageController'

interface LinkDetailsPageContentProps {
	vm: UseLinkDetailsPageControllerResult
}

export default function LinkDetailsPageContent({
	vm
}: LinkDetailsPageContentProps) {
	if (vm.isLoading) {
		return (
			<>
				<LinkDetailsHeaderSkeleton />
				{vm.currentTab === 'edit' ? <LinkEditViewSkeleton /> : null}
				{vm.currentTab === 'analytics' ? (
					<LinkAnalyticsSkeleton />
				) : null}
			</>
		)
	}
	if (!vm.link) return null

	return (
		<>
			<LinkDetailsHeader
				link={vm.link}
				linkId={vm.linkId}
				currentTab={vm.currentTab}
				safeNavigate={vm.safeNavigate}
				handlePauseItem={vm.handlePauseItem}
				handleResumeItem={vm.handleResumeItem}
				handleRestoreItem={vm.handleRestoreItem}
				handleDeleteItem={vm.handleDeleteItem}
				setShowQrModal={vm.setShowQrModal}
				handleCopy={vm.handleCopy}
				hideEditButton={vm.currentTab === 'edit'}
			/>

			<LinkDetailsContent
				currentTab={vm.currentTab}
				link={vm.link}
				linkId={vm.linkId}
				editFormData={vm.editFormData}
				saveLoading={vm.saveLoading}
				onSave={vm.handleSaveLink}
				onCancel={vm.handleCancel}
				onChange={vm.handleFormChange}
				onCopy={vm.handlePreviewCopy}
				onDownloadQr={vm.openQr}
			/>

			<LinkDetailsModals
				link={vm.link}
				showQrModal={vm.showQrModal}
				onQrClose={vm.closeQr}
				onQrCopy={vm.handleQrCopy}
				onQrDownload={vm.handleQrDownload}
				confirmModal={vm.confirmModal}
				actionLoading={vm.actionLoading}
				onConfirmClose={vm.handleCloseModal}
				onConfirm={vm.handleConfirmAction}
				unsavedModal={vm.unsavedModal}
				onStayOnPage={vm.handleStayOnPage}
				onLeaveWithoutSaving={vm.handleLeaveWithoutSaving}
				toast={vm.toast}
				onToastClose={vm.hideToast}
			/>
		</>
	)
}
