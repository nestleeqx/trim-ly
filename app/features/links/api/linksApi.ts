type CreateLinkPayload = {
	targetUrl: string
	slug: string
	title?: string
	tagIds?: string[]
	expiresAt?: string | null
	password?: string
}

type CreateLinkResponse = {
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
	trend?: number
	status: 'active' | 'paused' | 'expired' | 'deleted'
	tags: string[]
	createdAt: string
	expirationDate: string | null
	hasPassword: boolean
}

export type LinkAnalyticsResponse = {
	statsCards: Array<{
		id: 'clicks' | 'visitors' | 'avgPerDay' | 'topCountry' | 'qrScans'
		value: string
		change: number
	}>
	chart: {
		points: Array<{
			day: string
			date: string
			value: number
			unique: number
		}>
		total: string
		average: string
	}
	topCountries: Array<{
		code: string
		name: string
		clicks: number
		percentage: number
	}>
	deviceStats: Array<{
		type: string
		percentage: number
		color: string
	}>
	topReferrers: Array<{
		name: string
		clicks: number
	}>
	rawEvents: Array<{
		time: string
		country: {
			code: string
			name: string
		}
		device: {
			type: string
			name: string
		}
		browser: string
		referrer: string
	}>
}

type GetLinkByIdResponse = {
	link: LinkListItemDto
}

type UpdateLinkPayload = {
	targetUrl: string
	slug: string
	title?: string
	tags?: string[]
	expiresAt?: string | null
	passwordEnabled: boolean
	password?: string
}

type GetLinksResponse = {
	links: LinkListItemDto[]
	meta: {
		totalAll: number
		totalFiltered: number
		page: number
		pageSize: number
		totalPages: number
	}
}

type LinkAction = 'pause' | 'resume' | 'restore'
type BulkLinkAction = 'pause' | 'resume' | 'delete' | 'restore'

type ApiErrorResponse = {
	error?: string
	affected?: number
}

function extractApiError(data: unknown): string {
	if (
		typeof data === 'object' &&
		data !== null &&
		'error' in data &&
		typeof (data as { error: unknown }).error === 'string'
	) {
		return (data as ApiErrorResponse).error || ''
	}

	return ''
}

function extractAffected(data: unknown): number {
	if (
		typeof data === 'object' &&
		data !== null &&
		'affected' in data &&
		typeof (data as { affected: unknown }).affected === 'number'
	) {
		return (data as ApiErrorResponse).affected ?? 0
	}

	return 0
}

function emitBillingUpdated() {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event('billing-updated'))
	}
}

export function mapCreateLinkError(raw: string): string {
	switch (raw) {
		case 'Failed to fetch':
			return 'Не удалось загрузить данные. Проверьте соединение.'
		case 'Invalid target URL':
			return 'Введите корректный целевой URL.'
		case 'Target URL too long':
			return 'URL слишком длинный (максимум 2048 символов).'
		case 'Invalid slug':
			return 'Некорректный короткий адрес.'
		case 'Invalid title length':
			return 'Заголовок должен быть от 3 до 120 символов.'
		case 'Slug already taken':
			return 'Этот короткий адрес уже занят.'
		case 'Expiration date must be in the future':
			return 'Дата истечения должна быть в будущем.'
		case 'Invalid date range':
			return 'Некорректный диапазон дат.'
		case 'Invalid password length':
			return 'Пароль должен быть от 6 до 128 символов.'
		case 'Some tags are invalid':
			return 'Некоторые теги недоступны.'
		case 'Links limit reached':
			return 'Достигнут лимит ссылок для текущего тарифа.'
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
		case 'Invalid ids':
			return 'Некорректный список ссылок.'
		case 'Some links are invalid':
			return 'Часть ссылок недоступна для этого действия.'
		default:
			return raw || 'Не удалось выполнить операцию.'
	}
}

export async function getLinks(params?: {
	search?: string
	page?: number
	pageSize?: number
	sort?: 'created_date' | 'clicks' | 'title' | 'status' | 'expiration_date'
	order?: 'asc' | 'desc'
	tags?: string[]
	statuses?: Array<'active' | 'paused' | 'expired' | 'deleted'>
	datePreset?: '7d' | '30d' | 'custom' | null
	createdFrom?: string | null
	createdTo?: string | null
	includeTrend?: boolean
	includeCounts?: boolean
	signal?: AbortSignal
}): Promise<GetLinksResponse> {
	const searchParams = new URLSearchParams()
	if (params?.search?.trim()) searchParams.set('search', params.search.trim())
	if (params?.page) searchParams.set('page', String(params.page))
	if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize))
	if (params?.sort) searchParams.set('sort', params.sort)
	if (params?.order) searchParams.set('order', params.order)
	for (const tag of params?.tags || []) {
		const value = tag.trim()
		if (value) searchParams.append('tags', value)
	}
	for (const status of params?.statuses || []) {
		searchParams.append('status', status)
	}
	if (params?.datePreset === '7d' || params?.datePreset === '30d') {
		searchParams.set('datePreset', params.datePreset)
	}
	if (params?.createdFrom) searchParams.set('createdFrom', params.createdFrom)
	if (params?.createdTo) searchParams.set('createdTo', params.createdTo)
	if (params?.includeTrend === false) searchParams.set('includeTrend', '0')
	if (params?.includeCounts === false) searchParams.set('includeCounts', '0')
	const qs = searchParams.toString()
	const url = qs ? `/api/links?${qs}` : '/api/links'

	const res = await fetch(url, {
		method: 'GET',
		cache: 'no-store',
		signal: params?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	const response = data as Partial<GetLinksResponse>
	const links = (response.links || []).map(link => ({
		...link,
		tags: Array.isArray(link.tags) ? link.tags : []
	}))

	return {
		links,
		meta: {
			totalAll: Number(response.meta?.totalAll ?? links.length),
			totalFiltered: Number(response.meta?.totalFiltered ?? links.length),
			page: Number(response.meta?.page ?? 1),
			pageSize: Number(response.meta?.pageSize ?? 10),
			totalPages: Number(response.meta?.totalPages ?? 1)
		}
	}
}

export async function createLink(
	payload: CreateLinkPayload,
	options?: { signal?: AbortSignal }
): Promise<CreateLinkResponse> {
	const res = await fetch('/api/links', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		signal: options?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	emitBillingUpdated()
	return data as CreateLinkResponse
}

export async function getLinkById(
	id: string,
	signal?: AbortSignal
): Promise<GetLinkByIdResponse> {
	const res = await fetch(`/api/links/${id}`, {
		method: 'GET',
		cache: 'no-store',
		signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	return data as GetLinkByIdResponse
}

export async function getLinkAnalytics(
	id: string,
	params?: {
		period?: '7d' | '30d' | '90d' | 'custom'
		from?: string
		to?: string
		signal?: AbortSignal
	}
): Promise<LinkAnalyticsResponse> {
	const search = new URLSearchParams()
	if (params?.period) search.set('period', params.period)
	if (params?.from) search.set('from', params.from)
	if (params?.to) search.set('to', params.to)
	const qs = search.toString()
	const url = qs
		? `/api/links/${id}/analytics?${qs}`
		: `/api/links/${id}/analytics`

	const res = await fetch(url, {
		method: 'GET',
		cache: 'no-store',
		signal: params?.signal
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	return data as LinkAnalyticsResponse
}

export async function updateLink(
	id: string,
	payload: UpdateLinkPayload
): Promise<GetLinkByIdResponse> {
	const res = await fetch(`/api/links/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	return data as GetLinkByIdResponse
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
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	if (action === 'restore') {
		emitBillingUpdated()
	}
}

export async function deleteLink(id: string): Promise<void> {
	const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
	const data = await res.json().catch(() => ({}))

	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	emitBillingUpdated()
}

export async function bulkLinkAction(
	ids: string[],
	action: BulkLinkAction
): Promise<{ affected: number }> {
	const res = await fetch('/api/links/bulk', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ids, action })
	})

	const data = await res.json().catch(() => ({}))
	if (!res.ok) {
		throw new Error(mapCreateLinkError(extractApiError(data)))
	}

	if (action === 'delete' || action === 'restore') {
		emitBillingUpdated()
	}

	return {
		affected: extractAffected(data)
	}
}
