const isValidUrl = (url: string): boolean => {
	try {
		new URL(url)
		return true
	} catch {
		return false
	}
}

export const normalizeUrl = (url: string): string => {
	if (!url) return url
	const trimmed = url.trim()
	if (!trimmed) return trimmed

	if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
		return `https://${trimmed}`
	}
	return trimmed
}

export const validateUrl = (url: string): string | undefined => {
	if (!url) return 'URL обязателен для заполнения'
	const normalized = normalizeUrl(url)
	if (!isValidUrl(normalized)) return 'Некорректный URL'
	return undefined
}

export const validateExpirationDate = (date: string): string | undefined => {
	if (!date) return undefined
	const selectedDate = new Date(date)
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	if (selectedDate < today) {
		return 'Дата не может быть в прошлом'
	}
	return undefined
}
