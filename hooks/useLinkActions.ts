'use client'

import { LinkItem } from '@/types/links'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface UseLinkActionsProps {
	onCopy?: (shortUrl: string) => void
	onDelete?: (id: string) => void
	onPause?: (id: string) => void
	onResume?: (id: string) => void
	onRestore?: (id: string) => void
}

export const useLinkActions = ({
	onCopy,
	onDelete,
	onPause,
	onResume,
	onRestore
}: UseLinkActionsProps) => {
	const router = useRouter()
	const [openKebabId, setOpenKebabId] = useState<string | null>(null)
	const [qrModalLink, setQrModalLink] = useState<LinkItem | null>(null)

	const handleItemClick = useCallback((e: React.MouseEvent) => {
		const target = e.target as HTMLElement
		if (
			target.closest('button') ||
			target.closest('a') ||
			target.closest('input[type="checkbox"]')
		) {
			e.stopPropagation()
		}
	}, [])

	const handleTitleClick = useCallback(
		(linkId: string, e: React.MouseEvent) => {
			e.stopPropagation()
			router.push(`/links/${linkId}`)
		},
		[router]
	)

	const handleCopy = useCallback(
		(url: string, e?: React.MouseEvent) => {
			e?.stopPropagation()
			navigator.clipboard.writeText(`https://${url}`)
			onCopy?.(url)
		},
		[onCopy]
	)

	const handleQrClick = useCallback((link: LinkItem, e: React.MouseEvent) => {
		e.stopPropagation()
		setQrModalLink(link)
	}, [])

	const openQrModal = useCallback((link: LinkItem) => {
		setQrModalLink(link)
	}, [])

	const handleAnalyticsClick = useCallback(
		(linkId: string, e: React.MouseEvent) => {
			e.stopPropagation()
			router.push(`/analytics?link=${linkId}`)
		},
		[router]
	)

	const handleKebabClick = useCallback(
		(linkId: string, e: React.MouseEvent) => {
			e.stopPropagation()
			setOpenKebabId(openKebabId === linkId ? null : linkId)
		},
		[openKebabId]
	)

	const handleEdit = useCallback(
		(linkId: string) => {
			setOpenKebabId(null)
			router.push(`/links/${linkId}`)
		},
		[router]
	)

	const handleToggleStatus = useCallback(
		(link: LinkItem) => {
			setOpenKebabId(null)
			if (link.status === 'active' || link.status === 'paused') {
				if (link.status === 'active') {
					onPause?.(link.id)
				} else {
					onResume?.(link.id)
				}
			}
		},
		[onPause, onResume]
	)

	const handleDelete = useCallback(
		(linkId: string) => {
			setOpenKebabId(null)
			onDelete?.(linkId)
		},
		[onDelete]
	)

	const handleRestore = useCallback(
		(linkId: string) => {
			setOpenKebabId(null)
			onRestore?.(linkId)
		},
		[onRestore]
	)

	const handleDownloadQr = useCallback(() => {
		setQrModalLink(null)
	}, [])

	const handleCopyQrUrl = useCallback(() => {
		if (qrModalLink) {
			navigator.clipboard.writeText(`https://${qrModalLink.shortUrl}`)
			onCopy?.(qrModalLink.shortUrl)
		}
	}, [qrModalLink, onCopy])

	const closeQrModal = () => {
		setQrModalLink(null)
	}

	const closeKebabMenu = (e: React.MouseEvent) => {
		e.stopPropagation()
		setOpenKebabId(null)
	}

	return {
		openKebabId,
		qrModalLink,
		handleItemClick,
		handleCopy,
		handleQrClick,
		openQrModal,
		handleAnalyticsClick,
		handleKebabClick,
		handleEdit,
		handleToggleStatus,
		handleDelete,
		handleDownloadQr,
		handleCopyQrUrl,
		closeQrModal,
		closeKebabMenu,
		handleTitleClick,
		handleRestore
	}
}
