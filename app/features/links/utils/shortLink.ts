const DEFAULT_DEV_DOMAIN = 'localhost:3000'
const DEFAULT_PROD_DOMAIN = 't.ly'

function stripProtocol(value: string) {
	return value.replace(/^https?:\/\//i, '')
}

function stripTrailingSlash(value: string) {
	return value.replace(/\/+$/, '')
}

function normalizeDomain(value: string) {
	return stripTrailingSlash(stripProtocol(value.trim().toLowerCase()))
}

function getShortLinkDomain() {
	const fromEnv = process.env.NEXT_PUBLIC_SHORT_LINK_DOMAIN
	const normalized = fromEnv ? normalizeDomain(fromEnv) : ''
	if (normalized) return normalized
	return process.env.NODE_ENV === 'development'
		? DEFAULT_DEV_DOMAIN
		: DEFAULT_PROD_DOMAIN
}

function getShortLinkProtocol() {
	const fromEnv = process.env.NEXT_PUBLIC_SHORT_LINK_PROTOCOL
	if (fromEnv === 'http' || fromEnv === 'https') return fromEnv

	const domain = getShortLinkDomain()
	return domain.startsWith('localhost') || domain.startsWith('127.0.0.1')
		? 'http'
		: 'https'
}

export function buildShortLink(slug = '') {
	const domain = getShortLinkDomain()
	return slug ? `${domain}/${slug}` : `${domain}/`
}

export function toShortLinkHref(shortUrl: string) {
	if (/^https?:\/\//i.test(shortUrl)) return shortUrl
	return `${getShortLinkProtocol()}://${shortUrl}`
}

export function extractSlugFromShortLink(shortUrl: string) {
	const value = shortUrl.trim()
	if (!value) return ''

	const domain = getShortLinkDomain()
	const withSlash = `${domain}/`
	if (value.startsWith(withSlash)) {
		return value.slice(withSlash.length)
	}

	const raw = value.replace(/^https?:\/\//i, '')
	return raw.split('/').filter(Boolean).slice(-1)[0] ?? ''
}
