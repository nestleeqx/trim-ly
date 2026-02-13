export type TagDto = {
	id: string
	name: string
	slug: string
	createdAt: string
}

function mapTagApiError(raw: string): string {
	switch (raw) {
		case 'Unauthorized':
			return 'Сессия истекла. Войдите снова.'
		case 'Tag name is required':
			return 'Введите название тега.'
		case 'Tag name is too long (max 20)':
			return 'Название тега слишком длинное (макс. 20).'
		case 'Invalid tag name':
			return 'Некорректное название тега.'
		case 'Tag not found':
			return 'Тег не найден.'
		default:
			return raw || 'Ошибка работы с тегами.'
	}
}

async function parseJson<T>(res: Response): Promise<T> {
	const data = await res.json().catch(() => ({}))
	if (!res.ok)
		throw new Error(mapTagApiError(String((data as any)?.error ?? '')))
	return data as T
}

export async function getTags(): Promise<TagDto[]> {
	const res = await fetch('/api/tags', { method: 'GET', cache: 'no-store' })
	const data = await parseJson<{ tags: TagDto[] }>(res)
	return data.tags
}

export async function createTag(name: string): Promise<TagDto> {
	const res = await fetch('/api/tags', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	})
	const data = await parseJson<{ tag: TagDto }>(res)
	return data.tag
}

export async function deleteTag(id: string): Promise<void> {
	const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
	await parseJson<{ ok: true }>(res)
}
