'use client'

import styles from './QrCodeModal.module.scss'

interface QrCodeDisplayProps {
	size?: number
	value?: string
}

/**
 * QrCodeDisplay - отображает QR-код
 * TODO: Интегрировать реальную библиотеку QR-генератора (qrcode.react или qrcode)
 */
export default function QrCodeDisplay({
	size = 200,
	value
}: QrCodeDisplayProps) {
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
