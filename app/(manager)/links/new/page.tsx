'use client'

import styles from '@/app/(manager)/links/new/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Toast from '@/app/components/ui/Toast/Toast'
import LinkEditForm from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkEditView/LinkEditForm/LinkEditForm'
import LinkPreview from '@/app/features/links/components/LinkPreview/LinkPreview'
import useCreateLinkPage from '@/app/features/links/hooks/useCreateLinkPage'

export default function CreateLinkPage() {
	const {
		emptyLink,
		formData,
		isLoading,
		toast,
		hideToast,
		handleFormChange,
		handleSave,
		handleCancel,
		handlePreviewCopy,
		handleDownloadQr
	} = useCreateLinkPage()

	return (
		<>
			<DashboardHeader
				title='Создать новую короткую ссылку'
				subtitle='Создать новую короткую ссылку.'
				backHref='/links'
				showCreateButton={false}
			/>
			<div className={styles.content}>
				<div className={styles.editLayout}>
					<LinkEditForm
						link={emptyLink}
						onSave={handleSave}
						onCancel={handleCancel}
						onChange={handleFormChange}
						isLoading={isLoading}
						mode='create'
					/>
					<LinkPreview
						formData={formData}
						status='active'
						onCopy={handlePreviewCopy}
						onDownloadQr={handleDownloadQr}
					/>
				</div>
			</div>

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
				variant={toast.variant}
			/>
		</>
	)
}
