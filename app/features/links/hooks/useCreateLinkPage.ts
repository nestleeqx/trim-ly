'use client'

import {
	createLink,
	mapCreateLinkError
} from '@/app/features/links/api/linksApi'
import { createTag } from '@/app/features/links/api/tagsApi'
import { LinkEditFormData } from '@/app/features/links/components/LinkEdit/linkEdit.config'
import {
	EMPTY_LINK,
	INITIAL_LINK_FORM_DATA
} from '@/app/features/links/constants/newLinkDefaults'
import { withQrSource } from '@/app/features/links/utils/qrTracking'
import { buildShortLink, toShortLinkHref } from '@/app/features/links/utils/shortLink'
import { downloadQrPng } from '@/app/features/links/utils/downloadQrPng'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function useCreateLinkPage() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState<LinkEditFormData>(
		INITIAL_LINK_FORM_DATA
	)
	const { toast, showToast, hideToast } = useToast()

	const handleFormChange = useCallback((data: LinkEditFormData) => {
		setFormData(data)
	}, [])

	const ensureTagIds = useCallback(async (tags: string[]) => {
		const uniqueNames = [...new Set(tags.map(t => t.trim()).filter(Boolean))]
		if (!uniqueNames.length) return [] as string[]

		const results = await Promise.all(uniqueNames.map(name => createTag(name)))
		return results.map(t => t.id)
	}, [])

	const handleSave = useCallback(
		async (data: LinkEditFormData) => {
			setIsLoading(true)

			try {
				const slug = data.shortLink.trim()
				if (!slug) {
					showToast('Укажите короткую ссылку (slug).', 'error')
					return
				}

				const tagIds = await ensureTagIds(data.tags)

				await createLink({
					targetUrl: data.destinationUrl,
					slug,
					title: data.title?.trim() || undefined,
					tagIds,
					expiresAt: data.expirationDate || null,
					password: data.passwordEnabled
						? data.password?.trim() || undefined
						: undefined
				})

				showToast('Ссылка успешно создана', 'success')
				await new Promise(resolve => setTimeout(resolve, 1200))
				router.push('/links')
			} catch (e) {
				const message =
					e instanceof Error
						? mapCreateLinkError(e.message)
						: 'Не удалось создать ссылку.'
				showToast(message, 'error')
			} finally {
				setIsLoading(false)
			}
		},
		[ensureTagIds, router, showToast]
	)

	const handleCancel = useCallback(() => {
		router.push('/links')
	}, [router])

	const handlePreviewCopy = useCallback(() => {
		const shortUrl = formData.shortLink
			? buildShortLink(formData.shortLink)
			: buildShortLink()

		navigator.clipboard.writeText(toShortLinkHref(shortUrl))
		showToast('Ссылка скопирована')
	}, [formData.shortLink, showToast])

	const handleDownloadQr = useCallback(async () => {
		try {
			const slug = formData.shortLink.trim()
			if (!slug) {
				showToast('Сначала укажите slug для короткой ссылки.', 'error')
				return
			}

			const shortUrl = withQrSource(
				toShortLinkHref(buildShortLink(slug))
			)
			await downloadQrPng({
				value: shortUrl,
				fileName: `qr-${slug}.png`
			})
			showToast('QR-код сохранён', 'success')
		} catch {
			showToast('Не удалось скачать QR-код.', 'error')
		}
	}, [formData.shortLink, showToast])

	return {
		emptyLink: EMPTY_LINK,
		formData,
		isLoading,
		toast,
		hideToast,
		handleFormChange,
		handleSave,
		handleCancel,
		handlePreviewCopy,
		handleDownloadQr
	}
}
