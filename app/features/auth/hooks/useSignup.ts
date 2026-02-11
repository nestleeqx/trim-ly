import { signIn } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { signup, type SignupPayload } from '../api/authApi'

export function useSignup() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const submit = useCallback(async (payload: SignupPayload) => {
		setError(null)
		setIsLoading(true)

		try {
			await signup(payload)

			const signInRes = await signIn('credentials', {
				redirect: false,
				email: payload.email,
				password: payload.password
			})

			if (signInRes?.error) {
				throw new Error(
					'Аккаунт создан, но не удалось войти. Попробуйте логин.'
				)
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
