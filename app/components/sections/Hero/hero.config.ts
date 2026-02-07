import { CheckCircle2, Lock, Smartphone } from 'lucide-react'

export const heroFeatures = [
	{
		icon: CheckCircle2,
		text: 'Неограниченные редиректы'
	},
	{
		icon: Lock,
		text: 'Приватная статистика'
	},
	{
		icon: Smartphone,
		text: 'Работает на мобильных'
	}
] as const

export const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1
		}
	}
} as const

export const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5 }
	}
} as const
