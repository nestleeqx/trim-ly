'use client'

import { downloadQrPng } from '@/app/features/links/utils/downloadQrPng'
import { withQrSource } from '@/app/features/links/utils/qrTracking'
import {
	extractSlugFromShortLink,
	toShortLinkHref
} from '@/app/features/links/utils/shortLink'
import { LinkItem } from '@/types/links'
import { useCallback, useState } from 'react'

interface UseQrModalProps {
	link: LinkItem | undefined
	showToast: (message: string) => void
}

export const useQrModal = ({ link, showToast }: UseQrModalProps) => {
	const [showQrModal, setShowQrModal] = useState(false)

	const handleQrCopy = useCallback(() => {
		if (!link) return
		navigator.clipboard.writeText(toShortLinkHref(link.shortUrl))
		showToast('Ссылка скопирована')
	}, [link, showToast])

	const handleQrDownload = useCallback(async () => {
		if (!link) return
		try {
			const qrValue = withQrSource(toShortLinkHref(link.shortUrl))
			const slug = extractSlugFromShortLink(link.shortUrl) || link.id
			await downloadQrPng({
				value: qrValue,
				fileName: `qr-${slug}.png`
			})
			showToast('QR-код сохранен')
			setShowQrModal(false)
		} catch {
			showToast('Не удалось скачать QR-код')
		}
	}, [link, showToast])

	return {
		showQrModal,
		setShowQrModal,
		handleQrCopy,
		handleQrDownload
	}
}
