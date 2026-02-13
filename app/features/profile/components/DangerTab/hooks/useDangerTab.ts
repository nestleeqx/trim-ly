'use client'

import { mapProfileApiError } from '@/app/features/profile/utils/profileErrorMap'
import { signOut } from 'next-auth/react'
import { useCallback, useState } from 'react'

export default function useDangerTab() {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [password, setPassword] = useState('')
	const [noticeKey, setNoticeKey] = useState(0)
	const [deleteError, setDeleteError] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const [demoMessage, setDemoMessage] = useState<string | null>(null)

	const openDeleteModal = useCallback(() => {
		setDeleteError(null)
		setPassword('')
		setIsDeleteModalOpen(true)
	}, [])

	const closeDeleteModal = useCallback(() => {
		if (isDeleting) return
		setIsDeleteModalOpen(false)
	}, [isDeleting])

	const handleDeleteAccount = useCallback(async () => {
		setDeleteError(null)
		setIsDeleting(true)

		try {
			const res = await fetch('/api/profile/delete-account', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			})

			const data = await res.json().catch(() => ({}))
			if (!res.ok) {
				const mapped = mapProfileApiError(
					String(data?.error ?? ''),
					'Не удалось удалить аккаунт.'
				)
				throw new Error(mapped.message)
			}

			await signOut({ callbackUrl: '/' })
		} catch (e) {
			setDeleteError(
				e instanceof Error ? e.message : 'Не удалось удалить аккаунт.'
			)
		} finally {
			setIsDeleting(false)
		}
	}, [password])

	const showTransferDemo = useCallback(() => {
		setDemoMessage('Функция передачи workspace работает в демо-режиме.')
		setNoticeKey(k => k + 1)
	}, [])

	return {
		isDeleteModalOpen,
		password,
		deleteError,
		isDeleting,
		demoMessage,
		setPassword,
		openDeleteModal,
		closeDeleteModal,
		handleDeleteAccount,
		noticeKey,
		showTransferDemo
	}
}
