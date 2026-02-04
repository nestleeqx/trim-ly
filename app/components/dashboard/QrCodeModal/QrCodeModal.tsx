'use client'

import { LinkItem } from '@/types/links'
import { Copy, Download, X } from 'lucide-react'
import styles from './QrCodeModal.module.scss'

interface QrCodeModalProps {
	link: LinkItem
	onClose: () => void
	onCopyUrl: () => void
	onDownload: () => void
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
	link,
	onClose,
	onCopyUrl,
	onDownload
}) => {
	return (
		<div
			className={styles.qrOverlay}
			onClick={onClose}
		>
			<div
				className={styles.qrModal}
				onClick={e => e.stopPropagation()}
			>
				<div className={styles.qrHeader}>
					<h3 className={styles.qrTitle}>QR код</h3>
					<button
						className={styles.qrClose}
						onClick={onClose}
					>
						<X size={20} />
					</button>
				</div>
				<div className={styles.qrContent}>
					<div className={styles.qrCode} />
					<span className={styles.qrUrl}>
						{link.shortUrl}
					</span>
					<div className={styles.qrActions}>
						<button
							className={`${styles.qrBtn} ${styles.qrBtnSecondary}`}
							onClick={onCopyUrl}
						>
							<Copy size={16} />
							<span>Копировать URL</span>
						</button>
						<button
							className={`${styles.qrBtn} ${styles.qrBtnPrimary}`}
							onClick={onDownload}
						>
							<Download size={16} />
							<span>Скачать</span>
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
