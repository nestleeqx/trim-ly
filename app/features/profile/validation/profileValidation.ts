export function normalizeUsername(value: string) {
	return value.trim().toLowerCase().replace(/^@+/, '')
}

export function validateProfile(values: { name: string; username: string }) {
	const errors: Partial<Record<'name' | 'username', string>> = {}

	const name = values.name.trim()
	const username = normalizeUsername(values.username)

	if (name.length < 2) errors.name = 'Имя должно быть не короче 2 символов.'
	if (name.length > 60) errors.name = 'Имя слишком длинное.'

	if (username.length < 3) errors.username = 'Минимум 3 символа.'
	if (username.length > 24) errors.username = 'Максимум 24 символа.'
	if (!/^[a-z0-9-]+$/.test(username)) {
		errors.username = 'Только a-z, 0-9 и -.'
	}

	return { errors, normalized: { name, username } }
}
