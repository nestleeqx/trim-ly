import {
	BarChart3,
	LayoutDashboard,
	Link as LinkIcon,
	Settings
} from 'lucide-react'

export interface NavItem {
	href: string
	label: string
	icon: React.ComponentType<{ size?: number }>
	exact?: boolean
}

export const navItems: NavItem[] = [
	{
		href: '/dashboard',
		label: 'Дашборд',
		icon: LayoutDashboard,
		exact: true
	},
	{
		href: '/links',
		label: 'Ссылки',
		icon: LinkIcon
	},
	{
		href: '/analytics',
		label: 'Аналитика',
		icon: BarChart3
	},
	{
		href: '/settings',
		label: 'Настройки',
		icon: Settings
	}
]
