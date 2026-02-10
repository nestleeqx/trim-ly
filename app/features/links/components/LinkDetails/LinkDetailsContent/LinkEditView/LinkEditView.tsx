import { LinkEditFormData } from '@/app/features/links/components/LinkEdit/linkEdit.config'
import LinkPreview from '@/app/features/links/components/LinkPreview/LinkPreview'
import { LinkItem } from '@/types/links'
import LinkEditForm from './LinkEditForm/LinkEditForm'
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

export default function LinkEditView({
	link,
	editFormData,
	saveLoading,
	onSave,
	onCancel,
	onChange,
	onCopy,
	onDownloadQr
}: LinkEditViewProps) {
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
