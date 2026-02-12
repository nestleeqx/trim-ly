import { useCallback, useState } from 'react'
import { mapAuthApiError } from '../utils/authErrorMap'

export function useForgotPassword() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const submit = useCallback(async (email: string) => {
		setIsLoading(true)
		setError(null)

		try {
			const res = await fetch('/api/auth/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			})
			const data = await res.json().catch(() => ({}))

			if (!res.ok) {
				const mapped = mapAuthApiError(
					String((data as any)?.error ?? ''),
					'Не удалось отправить письмо. Попробуйте позже.'
				)
				throw new Error(mapped.message)
			}

			return { ok: true as const }
		} catch (e: any) {
			setError(e?.message ?? 'Не удалось отправить письмо. Попробуйте позже.')
			return { ok: false as const }
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { submit, isLoading, error }
}
