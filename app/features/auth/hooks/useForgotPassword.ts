import { useCallback, useState } from 'react'

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

			if (!res.ok) throw new Error()

			return { ok: true }
		} catch {
			setError('Не удалось отправить письмо. Попробуйте позже.')
			return { ok: false }
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { submit, isLoading, error }
}
