'use client'

import { getAuthErrorMessage } from '@/app/features/auth/utils/authError'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

type Props = {
	className?: string
}

export default function AuthErrorBanner({ className }: Props) {
	const params = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()
	const code = params.get('error')
	const message = getAuthErrorMessage(code)

	useEffect(() => {
		if (code) router.replace(pathname)
	}, [code, router, pathname])

	if (!message) return null

	return <p className={className}>{message}</p>
}
