export type CreateLinkPayload = {
	targetUrl: string
	slug: string
	title?: string
	tagIds?: string[]
	expiresAt?: string | null
	password?: string
}

export type CreateLinkResponse = {
	link: {
		id: string
		targetUrl: string
		slug: string
		title: string | null
		expiresAt: string | null
		createdAt: string
	}
}

export type LinkListItemDto = {
	id: string
	title: string
	shortUrl: string
	destination: string
	clicks: number
	status: 'active' | 'paused' | 'expired' | 'deleted'
	tags: string[]
	createdAt: string
	expirationDate: string | null
	hasPassword: boolean
}

export type LinkAction = 'pause' | 'resume'

export function mapCreateLinkError(raw: string): string {
	switch (raw) {
		case 'Failed to fetch':
			return 'Не удалось загрузить данные. Проверьте соединение.'
		case 'Invalid target URL':
			return 'Введите корректный целевой URL.'
		case 'Invalid slug':
			return 'Некорректный короткий адрес.'
		case 'Slug already taken':
			return 'Этот короткий адрес уже занят.'
		case 'Expiration date must be in the future':
			return 'Дата истечения должна быть в будущем.'
		case 'Invalid password length':
			return 'Пароль должен быть от 6 до 128 символов.'
		case 'Some tags are invalid':
			return 'Некоторые теги недоступны.'
		case 'Unauthorized':
			return 'Сессия истекла. Войдите снова.'
		case 'Invalid action':
			return 'Некорректное действие.'
		case 'Link not found':
			return 'Ссылка не найдена.'
		case 'Cannot resume expired link':
			return 'Нельзя возобновить истекшую ссылку.'
		case 'Invalid link id':
			return 'Некорректный идентификатор ссылки.'
		default:
			return raw || 'Не удалось выполнить операцию.'
	}
}

export async function getLinks(): Promise<LinkListItemDto[]> {
	const res = await fetch('/api/links', {
		method: 'GET',
		cache: 'no-store'
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(String((data as any)?.error ?? '')))
	}

	return ((data as { links?: LinkListItemDto[] }).links || []).map(link => ({
		...link,
		tags: Array.isArray(link.tags) ? link.tags : []
	}))
}

export async function createLink(
	payload: CreateLinkPayload
): Promise<CreateLinkResponse> {
	const res = await fetch('/api/links', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(String((data as any)?.error ?? '')))
	}

	return data as CreateLinkResponse
}

export async function patchLinkStatus(
	id: string,
	action: LinkAction
): Promise<void> {
	const res = await fetch(`/api/links/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action })
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(String((data as any)?.error ?? '')))
	}
}

export async function deleteLink(id: string): Promise<void> {
	const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
	const data = await res.json().catch(() => ({}))

	if (!res.ok) {
		throw new Error(mapCreateLinkError(String((data as any)?.error ?? '')))
	}
}
