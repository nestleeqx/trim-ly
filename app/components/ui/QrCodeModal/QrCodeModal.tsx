'use client'

import { LinkItem } from '@/types/links'
import React from 'react'
import Modal from '../Modal'
import { ActionButtons } from './ActionButtons'
import { QrCodeDisplay } from './QrCodeDisplay'
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

const QrCodeModal: React.FC<QrCodeModalProps> = ({
	link,
	url,
	onClose,
	onCopyUrl,
	onDownload,
	qrCodeSize = 200
}) => {
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

export default QrCodeModal
