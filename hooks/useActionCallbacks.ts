'use client'

import { useCallback } from 'react'

interface ActionMessages {
	copy?: string
	create?: string
	delete?: string
	pause?: string
	resume?: string
}

const DEFAULT_MESSAGES: ActionMessages = {
	copy: 'Скопировано!',
	create: 'Ссылка создана',
	delete: 'Ссылка удалена',
	pause: 'Ссылка приостановлена',
	resume: 'Ссылка возобновлена'
}

interface UseActionCallbacksProps {
	showToast: (message: string) => void
	messages?: ActionMessages
}

export const useActionCallbacks = ({
	showToast,
	messages = DEFAULT_MESSAGES
}: UseActionCallbacksProps) => {
	const handleCopy = useCallback(() => {
		if (messages.copy) {
			showToast(messages.copy)
		}
	}, [showToast, messages.copy])

	const handleCreate = useCallback(() => {
		if (messages.create) {
			showToast(messages.create)
		}
	}, [showToast, messages.create])

	const handleDelete = useCallback(() => {
		if (messages.delete) {
			showToast(messages.delete)
		}
	}, [showToast, messages.delete])

	const handlePause = useCallback(() => {
		if (messages.pause) {
			showToast(messages.pause)
		}
	}, [showToast, messages.pause])

	const handleResume = useCallback(() => {
		if (messages.resume) {
			showToast(messages.resume)
		}
	}, [showToast, messages.resume])

	return {
		handleCopy,
		handleCreate,
		handleDelete,
		handlePause,
		handleResume
	}
}
