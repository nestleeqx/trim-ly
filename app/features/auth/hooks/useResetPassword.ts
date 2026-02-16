import { useCallback, useState } from 'react'
import { mapAuthApiError } from '../utils/authErrorMap'

export function useResetPassword() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const submit = useCallback(async (token: string, password: string) => {
		setIsLoading(true)
		setError(null)

		try {
			const res = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password })
			})
			const data = await res.json().catch(() => ({}))

			if (!res.ok) {
				const errorMessage =
					typeof data === 'object' &&
					data !== null &&
					'error' in data &&
					typeof (data as { error: unknown }).error === 'string'
						? (data as { error: string }).error
						: ''

				const mapped = mapAuthApiError(
					errorMessage,
					'Не удалось сбросить пароль.'
				)
				throw new Error(mapped.message)
			}

			return { ok: true as const }
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: 'Ошибка сброса пароля.'
			setError(message)
			return { ok: false as const }
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { submit, isLoading, error, setError }
}
