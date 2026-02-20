export interface PreviewLink {
	title: string
	slug: string
	clicks: number
	status: 'active' | 'inactive'
}

export interface ChartDataPoint {
	name: string
	clicks: number
}

export type PreviewTab = 'links' | 'analytics'

export const mockLinks: PreviewLink[] = [
	{
		title: 'Запуск продукта',
		slug: 'trim.ly/launch-v2',
		clicks: 2453,
		status: 'active'
	},
	{
		title: 'Блог: Тренды 2026',
		slug: 'trim.ly/blog-trends',
		clicks: 1892,
		status: 'active'
	},
	{
		title: 'Промо-кампания',
		slug: 'trim.ly/sale-winter',
		clicks: 845,
		status: 'active'
	}
]

export const mockChartData: ChartDataPoint[] = [
	{ name: 'Пн', clicks: 120 },
	{ name: 'Вт', clicks: 190 },
	{ name: 'Ср', clicks: 150 },
	{ name: 'Чт', clicks: 280 },
	{ name: 'Пт', clicks: 220 },
	{ name: 'Сб', clicks: 340 },
	{ name: 'Вс', clicks: 290 }
]
