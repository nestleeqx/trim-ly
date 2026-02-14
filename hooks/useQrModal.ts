'use client'

import { toShortLinkHref } from '@/app/features/links/utils/shortLink'
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

	const handleQrDownload = useCallback(() => {
		showToast('QR-код сохранен')
		setShowQrModal(false)
	}, [showToast])

	return {
		showQrModal,
		setShowQrModal,
		handleQrCopy,
		handleQrDownload
	}
}
