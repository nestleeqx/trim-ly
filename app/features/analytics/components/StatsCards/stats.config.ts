import {
	Link as LinkIcon,
	LucideIcon,
	MousePointerClick,
	QrCode,
	TrendingUp
} from 'lucide-react'

interface StatCardConfig {
	id: string
	icon: LucideIcon
	label: string
	filterKey: string
}

export const statsConfig: StatCardConfig[] = [
	{
		id: 'clicks',
		icon: MousePointerClick,
		label: 'Количество кликов (24ч)',
		filterKey: 'clicks'
	},
	{
		id: 'links',
		icon: LinkIcon,
		label: 'Количество активных ссылок',
		filterKey: 'links'
	},
	{
		id: 'top',
		icon: TrendingUp,
		label: 'Топ клики по ссылке',
		filterKey: 'top'
	},
	{
		id: 'qr',
		icon: QrCode,
		label: 'Количество QR сканирований',
		filterKey: 'qr'
	}
]

export interface StatData {
	id: string
	value: string
	change: number
}

export const defaultStatsData: StatData[] = [
	{ id: 'clicks', value: '0', change: 0 },
	{ id: 'links', value: '0', change: 0 },
	{ id: 'top', value: '0', change: 0 },
	{ id: 'qr', value: '0', change: 0 }
]
