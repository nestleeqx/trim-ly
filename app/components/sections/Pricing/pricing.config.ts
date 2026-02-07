export interface PlanFeature {
	text: string
}

export interface Plan {
	name: string
	monthlyPrice: string
	yearlyPrice: string
	description: string
	features: PlanFeature[]
	buttonText: string
	buttonVariant: 'primary' | 'outline' | 'ghost'
	popular?: boolean
	href: string
	isContact?: boolean
	discount?: string
}

export const plans: Plan[] = [
	{
		name: 'Бесплатный',
		monthlyPrice: '0',
		yearlyPrice: '0',
		description: 'Идеально для старта и личного использования.',
		features: [
			{ text: '50 ссылок / месяц' },
			{ text: 'Базовая аналитика' },
			{ text: 'Статичные QR-коды' }
		],
		buttonText: 'Начать бесплатно',
		buttonVariant: 'outline',
		href: '/signup'
	},
	{
		name: 'Pro',
		monthlyPrice: '950',
		yearlyPrice: '9 500',
		description: 'Всё для развития вашего бренда.',
		features: [
			{ text: 'Безлимитные ссылки' },
			{ text: 'Расширенная аналитика' },
			{ text: 'Брендированные домены' },
			{ text: 'Динамические QR-коды' }
		],
		buttonText: 'Перейти на Pro',
		buttonVariant: 'primary',
		popular: true,
		href: '/signup?plan=pro',
		discount: 'Экономия 1 900 ₽'
	},
	{
		name: 'Команда',
		monthlyPrice: '3 400',
		yearlyPrice: '34 000',
		description: 'Масштабируйтесь с расширенными возможностями.',
		features: [
			{ text: 'Множество воркспейсов' },
			{ text: 'Командная работа' },
			{ text: 'API доступ' },
			{ text: 'Приоритетная поддержка' },
			{ text: 'SAML SSO' }
		],
		buttonText: 'Связаться с нами',
		buttonVariant: 'outline',
		href: '/contact',
		isContact: true,
		discount: 'Экономия 6 800 ₽'
	}
]
