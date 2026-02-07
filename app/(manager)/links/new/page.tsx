'use client'

import DashboardHeader from '@/app/components/dashboard/DashboardHeader'
import {
	LinkEditForm,
	LinkEditFormData,
	LinkPreview,
	SHORT_LINK_DOMAIN
} from '@/app/components/dashboard/LinkEdit'
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
					/>
				</div>
			</div>
		</>
	)
}
