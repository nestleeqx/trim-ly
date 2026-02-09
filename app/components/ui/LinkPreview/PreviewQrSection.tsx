'use client'

import Button from '@/app/components/ui/Button'
import { Download, QrCode } from 'lucide-react'
import React from 'react'
import styles from './LinkPreview.module.scss'

interface PreviewQrSectionProps {
	onDownloadQr: () => void
}

export const PreviewQrSection: React.FC<PreviewQrSectionProps> = ({
	onDownloadQr
}) => {
	return (
		<div className={styles.qrSection}>
			<div className={styles.qrInfo}>
				<QrCode
					size={40}
					className={styles.qrIcon}
				/>
				<div className={styles.qrText}>
					<span className={styles.qrTitle}>Динамический QR-код</span>
					<span className={styles.qrSubtitle}>
						Перенаправляет на целевую ссылку
					</span>
				</div>
			</div>
			<Button
				variant='ghost'
				size='sm'
				onClick={onDownloadQr}
			>
				<Download size={14} />
				Скачать
			</Button>
		</div>
	)
}
