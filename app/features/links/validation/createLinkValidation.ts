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

export function validateTitle(titleRaw: string): string | undefined {
	const title = titleRaw.trim()

	if (!title) return undefined
	if (title.length < 3 || title.length > 120) {
		return 'Заголовок должен быть от 3 до 120 символов.'
	}

	return undefined
}
