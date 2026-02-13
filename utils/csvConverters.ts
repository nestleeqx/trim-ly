import { ClickEvent, LinkItem } from '@/types/links'

const escapeCsvValue = (value: any): string => {
	if (value === null || value === undefined) return ''
	const str = String(value)
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`
	}
	return str
}

export const convertClickEventsToCsv = (data: ClickEvent[]): string => {
	const headers = [
		'time',
		'country_code',
		'country_name',
		'device_type',
		'device_name',
		'browser',
		'referrer'
	]

	const rows = data.map(evt => [
		evt.time,
		evt.country.code,
		evt.country.name,
		evt.device.type,
		evt.device.name,
		evt.browser,
		evt.referrer
	])

	return [
		headers.map(escapeCsvValue).join(','),
		...rows.map(row => row.map(escapeCsvValue).join(','))
	].join('\n')
}

export const convertStatsDataToCsv = <
	T extends { id: string; value: string | number; change: number }
>(
	data: T[]
): string => {
	const headers = ['id', 'value', 'change']

	const rows = data.map(d => [d.id, d.value, d.change])

	return [
		headers.map(escapeCsvValue).join(','),
		...rows.map(row => row.map(escapeCsvValue).join(','))
	].join('\n')
}

export const convertLinksToCsv = (data: LinkItem[]): string => {
	const headers = [
		'id',
		'title',
		'short_url',
		'destination',
		'clicks',
		'status',
		'tags',
		'created_at',
		'expiration_date',
		'has_password'
	]

	const rows = data.map(link => [
		link.id,
		link.title,
		link.shortUrl,
		link.destination,
		link.clicks,
		link.status,
		link.tags.join('|'),
		link.createdAt.toISOString(),
		link.expirationDate ? link.expirationDate.toISOString() : '',
		link.hasPassword ? 'true' : 'false'
	])

	return [
		headers.map(escapeCsvValue).join(','),
		...rows.map(row => row.map(escapeCsvValue).join(','))
	].join('\n')
}
