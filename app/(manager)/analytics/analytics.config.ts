export const periods = [
	{ key: '24h', label: '24ч' },
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
] as const

export type PeriodKey = (typeof periods)[number]['key']
