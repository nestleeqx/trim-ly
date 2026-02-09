'use client'

import { LinkStatus } from '@/types/links'
import { formatFullDate } from '@/utils/formatters'
import { Calendar, Lock, Tag } from 'lucide-react'
import React from 'react'
import {
	LinkEditFormData,
	SHORT_LINK_DOMAIN
} from '../../dashboard/LinkEdit/linkEdit.config'
import styles from './LinkPreview.module.scss'
import { PreviewDestinationUrl } from './PreviewDestinationUrl'
import { PreviewInfoRow } from './PreviewInfoRow'
import { PreviewQrSection } from './PreviewQrSection'
import { PreviewShortLink } from './PreviewShortLink'

interface LinkPreviewProps {
	formData: LinkEditFormData
	status: LinkStatus
	onCopy: () => void
	onDownloadQr: () => void
}

const LinkPreview: React.FC<LinkPreviewProps> = ({
	formData,
	status,
	onCopy,
	onDownloadQr
}) => {
	const shortUrl = formData.shortLink
		? `${SHORT_LINK_DOMAIN}${formData.shortLink}`
		: `${SHORT_LINK_DOMAIN}********`

	const tagsValue =
		formData.tags.length > 0 ? formData.tags.join(', ') : 'Нет'

	const expirationValue = formData.expirationDate
		? formatFullDate(formData.expirationDate)
		: 'Бессрочно'

	const passwordValue = formData.passwordEnabled ? 'Включён' : 'Отключён'

	return (
		<div className={styles.preview}>
			<div className={styles.previewHeader}>
				<h3 className={styles.previewTitle}>Предпросмотр</h3>
			</div>
			<div className={styles.previewContent}>
				<PreviewShortLink
					shortUrl={shortUrl}
					status={status}
					onCopy={onCopy}
				/>

				<PreviewDestinationUrl url={formData.destinationUrl} />

				<PreviewQrSection onDownloadQr={onDownloadQr} />
			</div>

			<PreviewInfoRow
				icon={Tag}
				label='Теги'
				value={tagsValue}
			/>

			<PreviewInfoRow
				icon={Calendar}
				label='Истечение'
				value={expirationValue}
			/>

			<PreviewInfoRow
				icon={Lock}
				label='Пароль'
				value={passwordValue}
			/>
		</div>
	)
}

export default LinkPreview
