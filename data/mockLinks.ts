import { LinkItem } from '@/types/links'

export const mockLinks: LinkItem[] = [
	{
		id: '1',
		title: 'Акция Чёрная пятница',
		shortUrl: 't.ly/bf-2026',
		destination: 'shop.com/sales/black-friday',
		clicks: 2314,
		status: 'active',
		tags: ['АКЦИЯ', 'ЗИМА'],
		createdAt: new Date('2026-01-15'),
		expirationDate: new Date('2026-02-15')
	},
	{
		id: '2',
		title: 'Ссылка в Instagram',
		shortUrl: 't.ly/insta',
		destination: 'instagram.com/trimly',
		clicks: 832,
		status: 'deleted',
		tags: ['СОЦСЕТИ'],
		createdAt: new Date('2026-01-10'),
		expirationDate: new Date('2026-06-10')
	},
	{
		id: '3',
		title: 'Запуск на Product Hunt',
		shortUrl: 't.ly/ph-launch',
		destination: 'producthunt.com/posts/sho',
		clicks: 1105,
		status: 'paused',
		tags: ['ЗАПУСК'],
		createdAt: new Date('2026-01-05'),
		expirationDate: new Date('2026-02-05')
	},
	{
		id: '4',
		title: 'Осенний реферал',
		shortUrl: 't.ly/fall-ref',
		destination: 'trim.ly/referral-autumn',
		clicks: 42,
		status: 'expired',
		tags: ['АКЦИЯ'],
		createdAt: new Date('2025-10-01'),
		expirationDate: new Date('2025-12-01')
	},
	{
		id: '5',
		title: 'Акция Чёрная пятница',
		shortUrl: 't.ly/bf-2026',
		destination: 'shop.com/sales/black-friday',
		clicks: 2314,
		status: 'active',
		tags: ['АКЦИЯ', 'ЗИМА'],
		createdAt: new Date('2026-01-15'),
		expirationDate: new Date('2026-02-15')
	},
	{
		id: '6',
		title: 'Ссылка в Instagram',
		shortUrl: 't.ly/insta',
		destination: 'instagram.com/trimly_',
		clicks: 832,
		status: 'deleted',
		tags: ['СОЦСЕТИ'],
		createdAt: new Date('2026-01-10'),
		expirationDate: new Date('2026-06-10')
	},
	{
		id: '7',
		title: 'Запуск на Product Hunt',
		shortUrl: 't.ly/ph-launch',
		destination: 'producthunt.com/posts/sho',
		clicks: 1105,
		status: 'paused',
		tags: ['ЗАПУСК'],
		createdAt: new Date('2026-01-05'),
		expirationDate: new Date('2026-02-05')
	},
	{
		id: '8',
		title: 'Осенний реферал',
		shortUrl: 't.ly/fall-ref',
		destination: 'trim.ly/referral-autumn',
		clicks: 42,
		status: 'expired',
		tags: ['АКЦИЯ'],
		createdAt: new Date('2025-10-01'),
		expirationDate: new Date('2025-12-01')
	},
	{
		id: '9',
		title: 'Запуск на Product Hunt',
		shortUrl: 't.ly/ph-launch',
		destination: 'producthunt.com/posts/sho',
		clicks: 1105,
		status: 'paused',
		tags: ['ЗАПУСК'],
		createdAt: new Date('2026-01-05'),
		expirationDate: new Date('2026-02-05')
	},
	{
		id: '10',
		title: 'Осенний реферал',
		shortUrl: 't.ly/fall-ref',
		destination: 'trim.ly/referral-autumn',
		clicks: 42,
		status: 'expired',
		tags: ['АКЦИЯ'],
		createdAt: new Date('2025-10-01'),
		expirationDate: new Date('2025-12-01')
	},
	{
		id: '11',
		title: 'Акция Чёрная пятница',
		shortUrl: 't.ly/bf-2026',
		destination: 'shop.com/sales/black-friday',
		clicks: 2314,
		status: 'active',
		tags: ['АКЦИЯ', 'ЗИМА'],
		createdAt: new Date('2026-01-15'),
		expirationDate: new Date('2026-02-15')
	}
]

export type LinkState =
	| 'redirecting'
	| 'password'
	| 'paused'
	| 'expired'
	| 'not-found'
	| 'error'

export const MOCK_LINKS: Record<
	string,
	{ state: LinkState; destination: string }
> = {
	'demo-redirect': {
		state: 'redirecting',
		destination: 'https://store.apple.com/shop/goto/iphone15pro'
	},
	'demo-password': {
		state: 'password',
		destination: 'https://example.com/secret'
	},
	'demo-paused': {
		state: 'paused',
		destination: 'https://example.com/paused'
	},
	'demo-expired': {
		state: 'expired',
		destination: 'https://example.com/expired'
	},
	'demo-not-found': {
		state: 'not-found',
		destination: ''
	},
	'demo-error': {
		state: 'error',
		destination: 'https://example.com/error'
	}
}
