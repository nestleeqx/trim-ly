'use client'

import { LinkItem } from '@/types/links'
import { Copy, Download } from 'lucide-react'
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import styles from './QrCodeModal.module.scss'

interface QrCodeModalBaseProps {
	onClose: () => void
	onDownload: () => void
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
	onDownload
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
				<div className={styles.qrCode} />
				<span className={styles.qrUrl}>{displayUrl}</span>
				<div className={styles.qrActions}>
					{showCopyButton && (
						<button
							className={`${styles.qrBtn} ${styles.qrBtnSecondary}`}
							onClick={onCopyUrl}
						>
							<Copy size={16} />
							<span>Копировать URL</span>
						</button>
					)}
					<Button
						variant='primary'
						className={`${styles.qrBtn}`}
						onClick={onDownload}
					>
						<Download size={16} />
						<span>Скачать</span>
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default QrCodeModal
