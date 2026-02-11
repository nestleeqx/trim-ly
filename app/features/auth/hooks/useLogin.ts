import { signIn } from 'next-auth/react'
import { useCallback, useState } from 'react'

type LoginPayload = { email: string; password: string; remember: boolean }

export function useLogin() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const submit = useCallback(async (payload: LoginPayload) => {
		setError(null)
		setIsLoading(true)
		try {
			const res = await signIn('credentials', {
				redirect: false,
				email: payload.email.trim().toLowerCase(),
				password: payload.password,
				remember: payload.remember ? '1' : '0'
			})

			if (res?.error) {
				throw new Error('Неверный email или пароль.')
			}

			return { ok: true as const }
		} catch (e: any) {
			setError(e?.message ?? 'Ошибка входа.')
			return { ok: false as const }
		} finally {
			setIsLoading(false)
		}
	}, [])

	return { submit, isLoading, error, setError }
}
