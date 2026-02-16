import { mapAuthApiError } from '../utils/authErrorMap'

export type SignupPayload = {
	email: string
	password: string
	name?: string
	username?: string
}

type SignupResponse = {
	id: string
	email: string
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
	const res = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
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
			'Не удалось создать аккаунт.'
		)
		throw new Error(mapped.message)
	}

	return data as SignupResponse
}
