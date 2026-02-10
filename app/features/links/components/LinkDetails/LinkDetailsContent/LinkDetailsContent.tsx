'use client'

import LinkAnalytics from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkAnalytics'
import LinkEditView from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkEditView/LinkEditView'
import { LinkItem } from '@/types/links'
import { LinkEditFormData } from '../../LinkEdit/linkEdit.config'

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

export default function LinkDetailsContent({
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
}: LinkDetailsContentProps) {
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
