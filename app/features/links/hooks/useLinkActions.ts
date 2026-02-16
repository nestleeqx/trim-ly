'use client'

import { downloadQrPng } from '@/app/features/links/utils/downloadQrPng'
import { withQrSource } from '@/app/features/links/utils/qrTracking'
import {
	extractSlugFromShortLink,
	toShortLinkHref
} from '@/app/features/links/utils/shortLink'
import { LinkItem } from '@/types/links'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface UseLinkActionsProps {
	onCopy?: (shortUrl: string) => void
	onEdit?: (id: string) => void
	onDelete?: (id: string) => void
	onPause?: (id: string) => void
	onResume?: (id: string) => void
	onRestore?: (id: string) => void
}

export const useLinkActions = ({
	onCopy,
	onEdit,
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
			navigator.clipboard.writeText(toShortLinkHref(url))
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
			router.push(`/links/${linkId}?tab=analytics`)
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
			if (onEdit) {
				onEdit(linkId)
				return
			}
			router.push(`/links/${linkId}`)
		},
		[onEdit, router]
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

	const handleDownloadQr = useCallback(async () => {
		if (!qrModalLink) return
		try {
			const qrValue = withQrSource(toShortLinkHref(qrModalLink.shortUrl))
			const slug =
				extractSlugFromShortLink(qrModalLink.shortUrl) || qrModalLink.id
			await downloadQrPng({
				value: qrValue,
				fileName: `qr-${slug}.png`
			})
			setQrModalLink(null)
		} catch {
			// noop: keeping current modal open is enough fallback here
		}
	}, [qrModalLink])

	const handleCopyQrUrl = useCallback(() => {
		if (qrModalLink) {
			navigator.clipboard.writeText(toShortLinkHref(qrModalLink.shortUrl))
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
