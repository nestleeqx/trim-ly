export function withQrSource(url: string) {
	try {
		const parsed = new URL(url)
		parsed.searchParams.set('src', 'qr')
		return parsed.toString()
	} catch {
		return url
	}
}
