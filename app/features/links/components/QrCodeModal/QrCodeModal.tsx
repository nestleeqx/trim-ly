'use client'

import Modal from '@/app/components/ui/Modal/Modal'
import { withQrSource } from '@/app/features/links/utils/qrTracking'
import { toShortLinkHref } from '@/app/features/links/utils/shortLink'
import { LinkItem } from '@/types/links'
import ActionButtons from './ActionButtons'
import QrCodeDisplay from './QrCodeDisplay'
import styles from './QrCodeModal.module.scss'

interface QrCodeModalBaseProps {
	onClose: () => void
	onDownload: () => void
	qrCodeSize?: number
}

interface QrCodeModalWithLinkProps extends QrCodeModalBaseProps {
	link: LinkItem
	url?: never
	onCopyUrl: () => void
}

interface QrCodeModalWithUrlProps extends QrCodeModalBaseProps {
	url: string
	link?: never
	onCopyUrl?: () => void
}

type QrCodeModalProps = QrCodeModalWithLinkProps | QrCodeModalWithUrlProps

export default function QrCodeModal({
	link,
	url,
	onClose,
	onCopyUrl,
	onDownload,
	qrCodeSize = 200
}: QrCodeModalProps) {
	const rawDisplayUrl = link?.shortUrl ?? url ?? ''
	const qrValue = rawDisplayUrl
		? withQrSource(toShortLinkHref(rawDisplayUrl))
		: ''
	const showCopyButton = Boolean(onCopyUrl)

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title='QR код'
		>
			<div className={styles.qrContent}>
				<QrCodeDisplay
					value={qrValue}
					size={qrCodeSize}
				/>
				<span className={styles.qrUrl}>{rawDisplayUrl}</span>
				<ActionButtons
					showCopyButton={showCopyButton}
					onCopy={onCopyUrl}
					onDownload={onDownload}
				/>
			</div>
		</Modal>
	)
}
