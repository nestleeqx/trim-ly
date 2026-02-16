'use client'

import { ToastVariant } from '@/app/components/ui/Toast/Toast'
import {
	getLinkById,
	mapCreateLinkError,
	updateLink
} from '@/app/features/links/api/linksApi'
import {
	LinkEditFormData
} from '@/app/features/links/components/LinkEdit/linkEdit.config'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
import {
	buildShortLink,
	extractSlugFromShortLink,
	toShortLinkHref
} from '@/app/features/links/utils/shortLink'
import { LinkItem } from '@/types/links'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UseLinkEditProps {
	link: LinkItem | undefined
	linkId: string
	setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>
	showToast: (message: string, variant?: ToastVariant) => void
}

export const useLinkEdit = ({
	link,
	linkId,
	setLinks,
	showToast
}: UseLinkEditProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const currentTab = (searchParams.get('tab') as string) || 'analytics'

	const [editFormData, setEditFormData] = useState<LinkEditFormData>({
		destinationUrl: '',
		shortLink: '',
		title: '',
		tags: [],
		folder: 'General',
		expirationDate: '',
		passwordEnabled: false,
		password: ''
	})
	const [saveLoading, setSaveLoading] = useState(false)
	const [isFormDirty, setIsFormDirty] = useState(false)
	const [unsavedModal, setUnsavedModal] = useState<{
		isOpen: boolean
		targetUrl: string | null
	}>({ isOpen: false, targetUrl: null })
	const pendingNavigationRef = useRef<string | null>(null)

	useEffect(() => {
		if (link) {
			setEditFormData({
				destinationUrl: link.destination,
				shortLink: extractSlugFromShortLink(link.shortUrl),
				title: link.title,
				tags: link.tags,
				folder: 'General',
				expirationDate: link.expirationDate
					? link.expirationDate.toISOString().split('T')[0]
					: '',
				passwordEnabled: link.hasPassword || false,
				password: ''
			})
			setIsFormDirty(false)
		}
	}, [link])

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isFormDirty && currentTab === 'edit') {
				e.preventDefault()
				e.returnValue = ''
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () =>
			window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isFormDirty, currentTab])

	const safeNavigate = useCallback(
		(url: string) => {
			if (isFormDirty && currentTab === 'edit') {
				pendingNavigationRef.current = url
				setUnsavedModal({ isOpen: true, targetUrl: url })
			} else {
				router.push(url)
			}
		},
		[isFormDirty, currentTab, router]
	)

	const handleLeaveWithoutSaving = useCallback(() => {
		setIsFormDirty(false)
		setUnsavedModal({ isOpen: false, targetUrl: null })
		if (pendingNavigationRef.current) {
			router.push(pendingNavigationRef.current)
			pendingNavigationRef.current = null
		}
	}, [router])

	const handleStayOnPage = useCallback(() => {
		pendingNavigationRef.current = null
		setUnsavedModal({ isOpen: false, targetUrl: null })
	}, [])

	const handleFormChange = useCallback(
		(data: LinkEditFormData, isDirty: boolean) => {
			setEditFormData(data)
			setIsFormDirty(isDirty)
		},
		[]
	)

	const handleSaveLink = useCallback(
		async (data: LinkEditFormData) => {
			setSaveLoading(true)
			try {
				await updateLink(linkId, {
					targetUrl: data.destinationUrl,
					slug: data.shortLink,
					title: data.title,
					tags: data.tags,
					expiresAt: data.expirationDate || null,
					passwordEnabled: data.passwordEnabled,
					password: data.password
				})

				const refreshed = await getLinkById(linkId)
				const updatedLink = mapLinkDtoToItem(refreshed.link)

				setLinks(prev =>
					prev.map(l => (l.id === linkId ? updatedLink : l))
				)
				setEditFormData({
					...data,
					shortLink: extractSlugFromShortLink(updatedLink.shortUrl),
					tags: updatedLink.tags,
					password: '',
					passwordEnabled: updatedLink.hasPassword || false,
					expirationDate: updatedLink.expirationDate
						? updatedLink.expirationDate.toISOString().split('T')[0]
						: ''
				})
				setIsFormDirty(false)
				showToast('Ссылка сохранена')
				router.push(`/links/${linkId}?tab=analytics`)
			} catch (error) {
				const message =
					error instanceof Error
						? mapCreateLinkError(error.message)
						: 'Ошибка сохранения'
				showToast(message, 'error')
			} finally {
				setSaveLoading(false)
			}
		},
		[linkId, setLinks, showToast, router]
	)

	const handlePreviewCopy = useCallback(() => {
		const shortUrl = editFormData.shortLink
			? buildShortLink(editFormData.shortLink)
			: link?.shortUrl || ''
		navigator.clipboard.writeText(toShortLinkHref(shortUrl))
		showToast('Ссылка скопирована')
	}, [editFormData.shortLink, link?.shortUrl, showToast])

	return {
		currentTab,
		editFormData,
		saveLoading,
		unsavedModal,
		handleFormChange,
		handleSaveLink,
		handlePreviewCopy,
		safeNavigate,
		handleLeaveWithoutSaving,
		handleStayOnPage
	}
}
