'use client'

import styles from '@/app/(manager)/links/new/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Button from '@/app/components/ui/Button/Button'
import Toast from '@/app/components/ui/Toast/Toast'
import LinkEditForm from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkEditView/LinkEditForm/LinkEditForm'
import LinkPreview from '@/app/features/links/components/LinkPreview/LinkPreview'
import useCreateLinkPage from '@/app/features/links/hooks/useCreateLinkPage'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
				subtitle='Заполните параметры ссылки и проверьте превью перед сохранением.'
				backHref='/links'
				hideBackButtonOnMobile
				showCreateButton={false}
				actions={
					<Link
						href='/links'
						className={styles.mobileBackAction}
					>
						<Button
							variant='ghost'
							size='sm'
						>
							<ArrowLeft size={16} />
							Назад
						</Button>
					</Link>
				}
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
