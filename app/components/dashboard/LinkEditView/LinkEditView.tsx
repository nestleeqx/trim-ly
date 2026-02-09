import { LinkEditForm } from '@/app/components/dashboard/LinkEdit'
import { LinkEditFormData } from '@/app/components/dashboard/LinkEdit/linkEdit.config'
import LinkPreview from '@/app/components/ui/LinkPreview'
import { LinkItem } from '@/types/links'
import styles from './LinkEditView.module.scss'

interface LinkEditViewProps {
	link: LinkItem
	linkId: string
	editFormData: LinkEditFormData
	saveLoading: boolean
	onSave: (data: LinkEditFormData) => Promise<void>
	onCancel: () => void
	onChange: (data: LinkEditFormData, isDirty: boolean) => void
	onCopy: () => void
	onDownloadQr: () => void
}

export const LinkEditView = ({
	link,
	editFormData,
	saveLoading,
	onSave,
	onCancel,
	onChange,
	onCopy,
	onDownloadQr
}: LinkEditViewProps) => {
	return (
		<div className={styles.editLayout}>
			<LinkEditForm
				link={link}
				onSave={onSave}
				onCancel={onCancel}
				onChange={onChange}
				isLoading={saveLoading}
			/>
			<LinkPreview
				formData={editFormData}
				status={link.status}
				onCopy={onCopy}
				onDownloadQr={onDownloadQr}
			/>
		</div>
	)
}
