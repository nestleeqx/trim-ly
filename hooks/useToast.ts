'use client'

import { ToastVariant } from '@/app/components/ui/Toast/Toast'
import { useCallback, useState } from 'react'

export interface ToastState {
	message: string
	isVisible: boolean
	variant: ToastVariant
}

export const useToast = () => {
	const [toast, setToast] = useState<ToastState>({
		message: '',
		isVisible: false,
		variant: 'success'
	})

	const showToast = useCallback(
		(message: string, variant: ToastVariant = 'success') => {
			setToast({ message, isVisible: true, variant })
		},
		[]
	)

	const hideToast = useCallback(() => {
		setToast(prev => ({ ...prev, isVisible: false }))
	}, [])

	return {
		toast,
		showToast,
		hideToast
	}
}
