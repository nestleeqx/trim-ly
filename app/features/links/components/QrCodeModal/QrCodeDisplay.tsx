'use client'

import { buildQrImageUrl } from '@/app/features/links/utils/downloadQrPng'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './QrCodeModal.module.scss'

interface QrCodeDisplayProps {
	size?: number
	value?: string
}

export default function QrCodeDisplay({
	size = 200,
	value
}: QrCodeDisplayProps) {
	const [src, setSrc] = useState('')

	useEffect(() => {
		let active = true

		if (!value) {
			const clearTimer = window.setTimeout(() => {
				if (active) setSrc('')
			}, 0)

			return () => {
				active = false
				window.clearTimeout(clearTimer)
			}
		}

		void buildQrImageUrl(value, Math.max(size, 256))
			.then(dataUrl => {
				if (!active) return
				setSrc(dataUrl)
			})
			.catch(() => {
				if (!active) return
				setSrc('')
			})

		return () => {
			active = false
		}
	}, [value, size])

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
			{src ? (
				<Image
					src={src}
					alt='QR код'
					width={size}
					height={size}
					className={styles.qrImage}
					unoptimized
				/>
			) : null}
		</div>
	)
}
