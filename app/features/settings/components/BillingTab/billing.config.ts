export interface Invoice {
	id: string
	date: string
	amount: string
	status: string
}

export const mockInvoices: Invoice[] = [
	{
		id: 'INV-2024-001',
		date: '01 окт. 2024',
		amount: '$0.00',
		status: 'Оплачено'
	},
	{
		id: 'INV-2024-002',
		date: '01 сен. 2024',
		amount: '$0.00',
		status: 'Оплачено'
	}
]

export interface UsageMetric {
	label: string
	current: string
	total: string
	percentage: number
	variant?: 'default' | 'alt'
}

export const mockUsageMetrics: UsageMetric[] = [
	{
		label: 'Создано ссылок',
		current: '6,500',
		total: '10,000',
		percentage: 65,
		variant: 'default'
	},
	{
		label: 'Всего кликов',
		current: '42.8k',
		total: '50k',
		percentage: 85,
		variant: 'alt'
	}
]
