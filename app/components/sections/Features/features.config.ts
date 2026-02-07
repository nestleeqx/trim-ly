import { BarChart3, Link2, QrCode } from 'lucide-react'

export const features = [
	{
		icon: Link2,
		title: 'Брендированные ссылки',
		description:
			'Кастомные алиасы, чистые URL и опциональные брендированные домены для доверия аудитории.',
		color: '#60a5fa'
	},
	{
		icon: BarChart3,
		title: 'Аналитика в реальном времени',
		description:
			'Глубокая аналитика кликов, источников, стран и устройств для оптимизации эффективности.',
		color: '#818cf8'
	},
	{
		icon: QrCode,
		title: 'QR-коды',
		description:
			'Генерируйте настраиваемые QR-коды для любой ссылки. Скачивайте в форматах SVG/PNG.',
		color: '#a78bfa'
	}
] as const

export const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.1 }
	}
} as const

export const cardVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 }
	}
} as const
