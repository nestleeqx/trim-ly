'use client'

import Button from '@/app/components/ui/Button/Button'
import { Download, QrCode } from 'lucide-react'
import styles from './LinkPreview.module.scss'

interface PreviewQrSectionProps {
	onDownloadQr: () => void
}

export default function PreviewQrSection({
	onDownloadQr
}: PreviewQrSectionProps) {
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
