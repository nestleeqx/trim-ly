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
		if (message !== undefined || reset !== '1') return
		const t = window.setTimeout(() => router.replace(pathname), autoHideMs)
		return () => window.clearTimeout(t)
	}, [autoHideMs, message, pathname, reset, router])

	useEffect(() => {
		const nextMessage = resolvedMessage ?? null
		const showTimer = window.setTimeout(() => {
			setVisibleMessage(nextMessage)
		}, 0)

		if (!nextMessage || autoHideMs <= 0) {
			return () => window.clearTimeout(showTimer)
		}

		const hideTimer = window.setTimeout(() => {
			setVisibleMessage(null)
		}, autoHideMs)

		return () => {
			window.clearTimeout(showTimer)
			window.clearTimeout(hideTimer)
		}
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
