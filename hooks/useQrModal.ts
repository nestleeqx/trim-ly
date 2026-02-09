'use client'

import { LinkItem } from '@/types/links'
import { useCallback, useState } from 'react'

interface UseQrModalProps {
	link: LinkItem | undefined
	showToast: (message: string) => void
}

export const useQrModal = ({ link, showToast }: UseQrModalProps) => {
	const [showQrModal, setShowQrModal] = useState(false)

	const handleQrCopy = useCallback(() => {
		if (link) {
			navigator.clipboard.writeText(`https://${link.shortUrl}`)
			showToast('Ссылка скопирована')
		}
	}, [link, showToast])

	const handleQrDownload = useCallback(() => {
		showToast('QR-код сохранён')
		setShowQrModal(false)
	}, [showToast])

	return {
		showQrModal,
		setShowQrModal,
		handleQrCopy,
		handleQrDownload
	}
}
