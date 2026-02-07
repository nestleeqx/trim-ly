import {
	Link as LinkIcon,
	LucideIcon,
	MousePointerClick,
	QrCode,
	TrendingUp
} from 'lucide-react'

export interface StatCardConfig {
	id: string
	icon: LucideIcon
	label: string
	iconBgColor: string
	filterKey: string
}

export const statsConfig: StatCardConfig[] = [
	{
		id: 'clicks',
		icon: MousePointerClick,
		label: 'Всего кликов (7д)',
		iconBgColor: '#eef2ff',
		filterKey: 'clicks'
	},
	{
		id: 'links',
		icon: LinkIcon,
		label: 'Активных ссылок',
		iconBgColor: '#f0fdf4',
		filterKey: 'links'
	},
	{
		id: 'top',
		icon: TrendingUp,
		label: 'Топ клики по ссылке',
		iconBgColor: '#eff6ff',
		filterKey: 'top'
	},
	{
		id: 'qr',
		icon: QrCode,
		label: 'QR сканирований',
		iconBgColor: '#faf5ff',
		filterKey: 'qr'
	}
]

export interface StatData {
	id: string
	value: string
	change: number
}

export const defaultStatsData: StatData[] = [
	{ id: 'clicks', value: '12 842', change: 12.4 },
	{ id: 'links', value: '48', change: 2.1 },
	{ id: 'top', value: '4 102', change: 8.5 },
	{ id: 'qr', value: '854', change: -4.2 }
]
