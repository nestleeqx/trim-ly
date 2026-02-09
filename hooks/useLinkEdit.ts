'use client'

import {
	LinkEditFormData,
	SHORT_LINK_DOMAIN
} from '@/app/components/dashboard/LinkEdit'
import { ToastVariant } from '@/app/components/ui/Toast/Toast'
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
				shortLink: link.shortUrl.replace(SHORT_LINK_DOMAIN, ''),
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
				await new Promise(resolve => setTimeout(resolve, 500))
				setLinks(prev =>
					prev.map(l =>
						l.id === linkId
							? {
									...l,
									destination: data.destinationUrl,
									shortUrl: `${SHORT_LINK_DOMAIN}${data.shortLink}`,
									title: data.title,
									tags: data.tags,
									expirationDate: data.expirationDate
										? new Date(data.expirationDate)
										: undefined,
									hasPassword: data.passwordEnabled
								}
							: l
					)
				)
				setEditFormData(data)
				setIsFormDirty(false)
				showToast('Ссылка сохранена')
				router.push(`/links/${linkId}?tab=analytics`)
			} catch {
				showToast('Ошибка сохранения', 'error')
			} finally {
				setSaveLoading(false)
			}
		},
		[linkId, setLinks, showToast, router]
	)

	const handlePreviewCopy = useCallback(() => {
		const shortUrl = editFormData.shortLink
			? `${SHORT_LINK_DOMAIN}${editFormData.shortLink}`
			: link?.shortUrl || ''
		navigator.clipboard.writeText(`https://${shortUrl}`)
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
