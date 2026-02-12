'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './NoticeBanner.module.scss'

type Props = {
	className?: string
	message?: string | null
	type?: 'success' | 'error' | 'info'
	autoHideMs?: number
}

export default function NoticeBanner({
	className,
	message,
	type = 'success',
	autoHideMs = 1500
}: Props) {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const reset = params.get('reset')
	const fallbackMessage =
		reset === '1' ? 'Пароль обновлён. Войдите с новым паролем.' : null
	const resolvedMessage = message ?? fallbackMessage
	const [visibleMessage, setVisibleMessage] = useState<string | null>(null)

	useEffect(() => {
		// Auto-hide only for legacy auth flow driven by query params.
		if (message !== undefined || reset !== '1') return
		const t = window.setTimeout(() => router.replace(pathname), autoHideMs)
		return () => window.clearTimeout(t)
	}, [autoHideMs, message, pathname, reset, router])

	useEffect(() => {
		setVisibleMessage(resolvedMessage ?? null)
		if (!resolvedMessage || autoHideMs <= 0) return

		const t = window.setTimeout(() => {
			setVisibleMessage(null)
		}, autoHideMs)

		return () => window.clearTimeout(t)
	}, [autoHideMs, resolvedMessage])

	if (!visibleMessage) return null

	const composedClassName = [styles.banner, styles[type], className]
		.filter(Boolean)
		.join(' ')

	return (
		<p
			className={composedClassName}
			role='status'
			aria-live='polite'
		>
			{visibleMessage}
		</p>
	)
}
