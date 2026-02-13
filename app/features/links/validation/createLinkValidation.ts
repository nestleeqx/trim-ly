export type CreateLinkErrors = Partial<
	Record<'targetUrl' | 'slug' | 'title' | 'expiresAt' | 'password', string>
>

export function validateSlug(slugRaw: string): string | undefined {
	const slug = slugRaw.trim()

	if (!slug) return 'Введите короткую ссылку.'
	if (slug.length < 3 || slug.length > 25) {
		return 'Короткий адрес должен быть от 3 до 25 символов.'
	}
	if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
		return 'Разрешены только буквы, цифры, "-" и "_".'
	}

	return undefined
}

export function validateCreateLink(values: {
	targetUrl: string
	slug: string
	title: string
	expiresAt: string
	password: string
}): CreateLinkErrors {
	const errors: CreateLinkErrors = {}

	const targetUrl = values.targetUrl.trim()
	const slug = values.slug.trim()
	const title = values.title.trim()
	const expiresAt = values.expiresAt.trim()
	const password = values.password.trim()

	try {
		const url = new URL(targetUrl)
		if (!['http:', 'https:'].includes(url.protocol)) {
			errors.targetUrl = 'URL должен начинаться с http:// или https://'
		}
	} catch {
		errors.targetUrl = 'Введите корректный URL.'
	}

	const slugError = validateSlug(slug)
	if (slugError) errors.slug = slugError

	if (title.length > 120) {
		errors.title = 'Название не должно быть длиннее 120 символов.'
	}

	if (expiresAt) {
		const date = new Date(expiresAt)
		if (Number.isNaN(date.getTime())) {
			errors.expiresAt = 'Некорректная дата.'
		} else if (date.getTime() <= Date.now()) {
			errors.expiresAt = 'Дата должна быть в будущем.'
		}
	}

	if (password && (password.length < 6 || password.length > 128)) {
		errors.password = 'Пароль должен быть от 6 до 128 символов.'
	}

	return errors
}
