'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
	className?: string
}

export default function AuthNoticeBanner({ className }: Props) {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	const reset = params.get('reset')

	const message =
		reset === '1' ? 'Пароль обновлён. Войдите с новым паролем.' : null

	useEffect(() => {
		if (reset !== '1') return
		const t = window.setTimeout(() => router.replace(pathname), 1500)
		return () => window.clearTimeout(t)
	}, [reset, router, pathname])

	if (!message) return null

	return <p className={className}>{message}</p>
}
