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
}

export const linkStatsConfig: LinkStatCardConfig[] = [
	{
		id: 'clicks',
		icon: MousePointerClick,
		label: 'Всего кликов'
	},
	{
		id: 'visitors',
		icon: Users,
		label: 'Уникальные посетители'
	},
	{
		id: 'avgPerDay',
		icon: Calendar,
		label: 'Среднее в день'
	},
	{
		id: 'topCountry',
		icon: Globe,
		label: 'Топ страна'
	},
	{
		id: 'qrScans',
		icon: QrCode,
		label: 'QR-сканирования'
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
