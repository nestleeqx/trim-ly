import {
	Calendar,
	Globe,
	LucideIcon,
	MousePointerClick,
	QrCode,
	Users
} from 'lucide-react'

interface LinkStatCardConfig {
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
		label: 'Уникальные посетители',
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
	},
	{
		id: 'qrScans',
		icon: QrCode,
		label: 'QR-сканирования',
		iconBgColor: '#eef2ff'
	}
]

export interface LinkStatData {
	id: string
	value: string
	change: number
}

export const defaultLinkStatsData: LinkStatData[] = [
	{ id: 'clicks', value: '0', change: 0 },
	{ id: 'visitors', value: '0', change: 0 },
	{ id: 'avgPerDay', value: '0', change: 0 },
	{ id: 'topCountry', value: '—', change: 0 },
	{ id: 'qrScans', value: '0', change: 0 }
]
