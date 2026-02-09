'use client'

import { LinkEditView } from '@/app/components/dashboard/LinkEditView'
import { LinkAnalytics } from '@/app/components/ui/LinkAnalytics'
import { LinkItem } from '@/types/links'
import React from 'react'
import { LinkEditFormData } from '../LinkEdit/linkEdit.config'
import styles from '../page.module.scss'

interface LinkDetailsContentProps {
	currentTab: string
	link: LinkItem
	linkId: string
	editFormData: LinkEditFormData
	saveLoading: boolean
	onSave: (data: LinkEditFormData) => void
	onCancel: () => void
	onChange: (data: LinkEditFormData, isDirty: boolean) => void
	onCopy: (url: string) => void
	onDownloadQr: () => void
}

export const LinkDetailsContent: React.FC<LinkDetailsContentProps> = ({
	currentTab,
	link,
	linkId,
	editFormData,
	saveLoading,
	onSave,
	onCancel,
	onChange,
	onCopy,
	onDownloadQr
}) => {
	return (
		<>
			{currentTab === 'analytics' ? (
				<LinkAnalytics />
			) : (
				<LinkEditView
					link={link}
					linkId={linkId}
					editFormData={editFormData}
					saveLoading={saveLoading}
					onSave={onSave}
					onCancel={onCancel}
					onChange={onChange}
					onCopy={onCopy}
					onDownloadQr={onDownloadQr}
				/>
			)}
		</>
	)
}
