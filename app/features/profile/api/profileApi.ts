import type { ProfileDto, UpdateProfilePayload } from '../types/profile'

export type ThemeValue = 'light' | 'dark' | 'system'
export type BillingPlanStatus = 'active' | 'canceled' | 'past_due'

export type BillingResponse = {
	plan: {
		id: string
		name: string
		status: BillingPlanStatus
	}
	usage: {
		linksCreated: number
		linksLimit: number
		clicksTotal: number
		clicksLimit: number
	}
	invoices: Array<{
		id: string
		date: string
		amount: string
		status: string
		receiptUrl?: string
	}>
}

async function parseJson<T>(res: Response): Promise<T> {
	const data = await res.json().catch(() => ({}))
	if (!res.ok) throw new Error((data as any)?.error ?? 'Request failed')
	return data as T
}

export async function getProfile(): Promise<ProfileDto> {
	const res = await fetch('/api/profile/personal-data/', {
		method: 'GET',
		cache: 'no-store'
	})
	return parseJson<ProfileDto>(res)
}

export async function updateProfile(
	payload: UpdateProfilePayload
): Promise<ProfileDto> {
	const res = await fetch('/api/profile/personal-data/', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
	return parseJson<ProfileDto>(res)
}

export async function uploadAvatar(
	avatarURL: string
): Promise<{ avatarURL: string }> {
	const res = await fetch('/api/profile/personal-data/avatar', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ avatarURL })
	})
	return parseJson<{ avatarURL: string }>(res)
}

export async function removeAvatar(): Promise<{ ok: true }> {
	const res = await fetch('/api/profile/personal-data/avatar', {
		method: 'DELETE'
	})
	return parseJson<{ ok: true }>(res)
}

export async function getPreferences(): Promise<{ theme: ThemeValue }> {
	const res = await fetch('/api/profile/preferences', {
		method: 'GET',
		cache: 'no-store'
	})
	return parseJson<{ theme: ThemeValue }>(res)
}

export async function updatePreferences(payload: {
	theme: ThemeValue
}): Promise<{ theme: ThemeValue }> {
	const res = await fetch('/api/profile/preferences', {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})
	return parseJson<{ theme: ThemeValue }>(res)
}

export async function getBilling(): Promise<BillingResponse> {
	const res = await fetch('/api/profile/billing', {
		method: 'GET',
		cache: 'no-store'
	})
	return parseJson<BillingResponse>(res)
}
