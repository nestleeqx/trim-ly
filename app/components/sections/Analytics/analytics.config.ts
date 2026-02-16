export type Period = '7d' | '30d' | 'custom'

export interface TrafficSource {
	name: string
	value: number
	color: string
}

interface PeriodData {
	trafficSources: TrafficSource[]
	mobilePercent: number
	topLocation: string
	topLocationPercent: number
	subtitle: string
}

interface PeriodTab {
	id: Period
	label: string
}

export const periodTabs: PeriodTab[] = [
	{ id: '7d', label: '7д' },
	{ id: '30d', label: '30д' },
	{ id: 'custom', label: 'Всё' }
]

export const periodData: Record<Period, PeriodData> = {
	'7d': {
		trafficSources: [
			{ name: 'Instagram', value: 52, color: '#4f46e5' },
			{ name: 'Twitter', value: 22, color: '#94a3b8' },
			{ name: 'Direct', value: 15, color: '#cbd5e1' },
			{ name: 'Другие', value: 11, color: '#e2e8f0' }
		],
		mobilePercent: 72,
		topLocation: 'Германия',
		topLocationPercent: 38,
		subtitle: 'Результаты за 7 дней'
	},
	'30d': {
		trafficSources: [
			{ name: 'Instagram', value: 45, color: '#4f46e5' },
			{ name: 'Twitter', value: 28, color: '#94a3b8' },
			{ name: 'Direct', value: 18, color: '#cbd5e1' },
			{ name: 'Другие', value: 9, color: '#e2e8f0' }
		],
		mobilePercent: 65,
		topLocation: 'США',
		topLocationPercent: 42,
		subtitle: 'Результаты за 30 дней'
	},
	custom: {
		trafficSources: [
			{ name: 'Instagram', value: 38, color: '#4f46e5' },
			{ name: 'Twitter', value: 31, color: '#94a3b8' },
			{ name: 'Direct', value: 20, color: '#cbd5e1' },
			{ name: 'Другие', value: 11, color: '#e2e8f0' }
		],
		mobilePercent: 58,
		topLocation: 'Россия',
		topLocationPercent: 35,
		subtitle: 'Результаты за всё время'
	}
}

export const checklistItems = [
	'Ежедневные и почасовые тренды кликов',
	'Отслеживание источников и кампаний',
	'Разбивка по устройствам и гео',
	'Экспорт статистики в CSV'
]

interface DeviceLegendItem {
	color: string
	label: string
}

export const deviceLegend: DeviceLegendItem[] = [
	{ color: '#818cf8', label: 'Mobile' },
	{ color: '#c4b5fd', label: 'Desktop' },
	{ color: '#e2e8f0', label: 'Tablet' }
]
