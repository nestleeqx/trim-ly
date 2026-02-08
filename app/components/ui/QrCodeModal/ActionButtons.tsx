'use client'

import { Copy, Download } from 'lucide-react'
import React from 'react'
import Button from '../Button'
import styles from './QrCodeModal.module.scss'

interface ActionButtonsProps {
	showCopyButton: boolean
	onCopy?: () => void
	onDownload: () => void
}

/**
 * ActionButtons - кнопки действий в QR модали (Копировать URL, Скачать)
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
	showCopyButton,
	onCopy,
	onDownload
}) => {
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
					className={`${styles.qrBtn} ${styles.qrBtnSecondary}`}
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
