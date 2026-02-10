import {
	Calendar,
	Globe,
	LucideIcon,
	MousePointerClick,
	Users
} from 'lucide-react'

export interface LinkStatCardConfig {
	id: string
	icon: LucideIcon
	label: string
	iconBgColor: string
}

export const linkStatsConfig: LinkStatCardConfig[] = [
	{
		id: 'clicks',
		icon: MousePointerClick,
		label: 'Всего кликов',
		iconBgColor: '#eef2ff'
	},
	{
		id: 'visitors',
		icon: Users,
		label: 'Уникальный посетителей',
		iconBgColor: '#eef2ff'
	},
	{
		id: 'avgPerDay',
		icon: Calendar,
		label: 'Среднее в день',
		iconBgColor: '#f5f5f5'
	},
	{
		id: 'topCountry',
		icon: Globe,
		label: 'Топ страна',
		iconBgColor: '#eef2ff'
	}
]

export interface LinkStatData {
	id: string
	value: string
	change: number
}

export const defaultLinkStatsData: LinkStatData[] = [
	{ id: 'clicks', value: '2,314', change: 12.4 },
	{ id: 'visitors', value: '1,842', change: 8.2 },
	{ id: 'avgPerDay', value: '324', change: -2.1 },
	{ id: 'topCountry', value: 'США (48%)', change: 1.5 }
]
