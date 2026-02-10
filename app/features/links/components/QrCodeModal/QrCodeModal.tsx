'use client'

import Modal from '@/app/components/ui/Modal/Modal'
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
	const displayUrl = link?.shortUrl ?? url ?? ''
	const showCopyButton = Boolean(onCopyUrl)

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			title='QR код'
		>
			<div className={styles.qrContent}>
				<QrCodeDisplay
					value={displayUrl}
					size={qrCodeSize}
				/>
				<span className={styles.qrUrl}>{displayUrl}</span>
				<ActionButtons
					showCopyButton={showCopyButton}
					onCopy={onCopyUrl}
					onDownload={onDownload}
				/>
			</div>
		</Modal>
	)
}
