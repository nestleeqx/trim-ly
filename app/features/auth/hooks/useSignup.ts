import { signIn } from 'next-auth/react'
import { useCallback, useState } from 'react'
import { signup, type SignupPayload } from '../api/authApi'
import { mapAuthApiError } from '../utils/authErrorMap'

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
				const mapped = mapAuthApiError(
					String(signInRes.error),
					'Аккаунт создан, но не удалось войти. Попробуйте логин.'
				)
				throw new Error(mapped.message)
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
