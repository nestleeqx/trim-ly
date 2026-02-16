'use client'

import Button from '@/app/components/ui/Button/Button'
import cn from 'classnames'
import { Copy, Download } from 'lucide-react'
import styles from './QrCodeModal.module.scss'

interface ActionButtonsProps {
	showCopyButton: boolean
	onCopy?: () => void
	onDownload: () => void
}

export default function ActionButtons({
	showCopyButton,
	onCopy,
	onDownload
}: ActionButtonsProps) {
	return (
		<div className={styles.qrActions}>
			<Button
				variant='primary'
				className={styles.qrBtn}
				onClick={onDownload}
				title='Скачать QR-код'
			>
				<Download size={16} />
				<span>Скачать</span>
			</Button>
			{showCopyButton && onCopy && (
				<Button
					className={cn(styles.qrBtn, styles.qrBtnSecondary)}
					onClick={onCopy}
					variant='outline'
					title='Копировать URL в буфер обмена'
				>
					<Copy size={16} />
					<span>Копировать URL</span>
				</Button>
			)}
		</div>
	)
}
