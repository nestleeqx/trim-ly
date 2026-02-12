import { mapAuthApiError } from '../utils/authErrorMap'

export type SignupPayload = {
	email: string
	password: string
	name?: string
	username?: string
}

export type SignupResponse = {
	id: string
	email: string
}

export class ApiError extends Error {
	status: number
	constructor(message: string, status: number) {
		super(message)
		this.status = status
	}
}

export async function signup(payload: SignupPayload): Promise<SignupResponse> {
	const res = await fetch('/api/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
	const data = await res.json().catch(() => ({}))

	if (!res.ok) {
		const mapped = mapAuthApiError(
			String((data as any)?.error ?? ''),
			'Не удалось создать аккаунт.'
		)
		throw new Error(mapped.message)
	}

	return data as SignupResponse
}
