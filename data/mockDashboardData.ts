import { DeviceStats, TopCountry, TopReferrer } from '@/types/charts'

export const mockTopCountries: TopCountry[] = [
	{ code: 'RU', name: 'Россия', clicks: 1240, percentage: 43 },
	{ code: 'US', name: 'США', clicks: 410, percentage: 21 },
	{ code: 'DE', name: 'Германия', clicks: 320, percentage: 12 },
	{ code: 'FR', name: 'Франция', clicks: 210, percentage: 8 }
]

export const mockDeviceStats: DeviceStats[] = [
	{ type: 'Mobile', percentage: 62, color: '#4f46e5' },
	{ type: 'Desktop', percentage: 34, color: '#a5b4fc' },
	{ type: 'Tablet', percentage: 4, color: '#e0e7ff' }
]

export const mockTopReferrers: TopReferrer[] = [
	{ name: 'instagram.com', clicks: 407 },
	{ name: 'google.com', clicks: 139 },
	{ name: 'twitter.com', clicks: 223 },
	{ name: 'direct', clicks: 276 },
	{ name: 'facebook.com', clicks: 255 }
]
