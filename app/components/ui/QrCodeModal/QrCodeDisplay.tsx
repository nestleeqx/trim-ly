'use client'

import React from 'react'
import styles from './QrCodeModal.module.scss'

interface QrCodeDisplayProps {
	size?: number
	value?: string
}

/**
 * QrCodeDisplay - отображает QR-код
 * TODO: Интегрировать реальную библиотеку QR-генератора (qrcode.react или qrcode)
 */
export const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({
	size = 200,
	value
}) => {
	return (
		<div
			className={styles.qrCode}
			style={{
				width: `${size}px`,
				height: `${size}px`
			}}
			title={value ? `QR код для ${value}` : 'QR код'}
			role='img'
			aria-label={value ? `QR код для ${value}` : 'QR код'}
		>
			{/* Плейсхолдер для QR-кода */}
			{/* Когда добавится библиотека, сюда будет QR компонент */}
		</div>
	)
}
