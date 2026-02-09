'use client'

import {
	LinkEditForm,
	LinkEditFormData,
	SHORT_LINK_DOMAIN
} from '@/app/components/dashboard/LinkEdit'
import DashboardHeader from '@/app/components/ui/DashboardHeader'
import LinkPreview from '@/app/components/ui/LinkPreview'
import Toast from '@/app/components/ui/Toast/Toast'
import { useToast } from '@/hooks/useToast'
import { LinkItem } from '@/types/links'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import styles from './page.module.scss'

const emptyLink: LinkItem = {
	id: 'new',
	title: '',
	shortUrl: `${SHORT_LINK_DOMAIN}`,
	destination: '',
	clicks: 0,
	status: 'active',
	tags: [],
	createdAt: new Date()
}

export default function CreateLinkPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const { toast, showToast, hideToast } = useToast()
	const [formData, setFormData] = useState<LinkEditFormData>({
		title: '',
		destinationUrl: '',
		shortLink: '',
		tags: [],
		expirationDate: '',
		password: '',
		iosRedirect: '',
		androidRedirect: ''
	})
	const handleFormChange = useCallback((data: LinkEditFormData) => {
		setFormData(data)
	}, [])

	const handleSave = useCallback(
		async (data: LinkEditFormData) => {
			setIsLoading(true)
			await new Promise(resolve => setTimeout(resolve, 1000))
			setIsLoading(false)
			router.push('/links')
		},
		[router]
	)

	const handleCancel = useCallback(() => {
		router.push('/links')
	}, [router])

	const handlePreviewCopy = useCallback(() => {
		const shortUrl = formData.shortLink
			? `${SHORT_LINK_DOMAIN}${formData.shortLink}`
			: `${SHORT_LINK_DOMAIN}`
		navigator.clipboard.writeText(`https://${shortUrl}`)
		showToast('Ссылка скопирована')
	}, [formData.shortLink, showToast])

	const handleDownloadQr = useCallback(() => {
		showToast('QR-код сохранён')
	}, [showToast])

	return (
		<>
			<DashboardHeader
				title='Создать новую короткую ссылку'
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
