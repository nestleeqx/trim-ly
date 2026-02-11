import { useCallback, useState } from 'react'

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

			if (!res.ok) {
				const data = await res.json().catch(() => null)
				throw new Error(data?.error ?? 'Не удалось сбросить пароль.')
			}

			return { ok: true as const }
		} catch (e: any) {
			setError(e?.message ?? 'Ошибка')
			return { ok: false as const }
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { submit, isLoading, error, setError }
}
