interface PlanFeature {
	text: string
}

interface Plan {
	id: 'free' | 'pro' | 'team'
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
		id: 'free',
		name: 'Бесплатный',
		monthlyPrice: '0',
		yearlyPrice: '0',
		description: 'Идеально для старта и личного использования.',
		features: [
			{ text: '10 ссылок / месяц' },
			{ text: '1 000 кликов / месяц' },
			{ text: 'Базовая аналитика' },
			{ text: 'Статичные QR-коды' }
		],
		buttonText: 'Начать бесплатно',
		buttonVariant: 'outline',
		href: '/signup'
	},
	{
		id: 'pro',
		name: 'Pro',
		monthlyPrice: '950',
		yearlyPrice: '9 500',
		description: 'Всё для развития вашего бренда.',
		features: [
			{ text: '1 000 ссылок / месяц' },
			{ text: '100 000 кликов / месяц' },
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
		id: 'team',
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

interface DashboardPlan {
	id: 'free' | 'pro' | 'team'
	name: string
	description: string
	monthlyPrice: string | number
	yearlyPrice: string | number
	features: PlanFeature[]
	buttonText: string
	buttonVariant: 'primary' | 'outline'
	popular?: boolean
	isContact?: boolean
	discount?: string
}

function toDashboardPlan(plan: Plan): DashboardPlan {
	return {
		id: plan.id,
		name: plan.name,
		description: plan.description,
		monthlyPrice: plan.monthlyPrice,
		yearlyPrice: plan.yearlyPrice,
		features: plan.features,
		buttonText: plan.buttonText,
		buttonVariant: plan.buttonVariant === 'primary' ? 'primary' : 'outline',
		popular: plan.popular,
		isContact: Boolean(plan.isContact),
		discount: plan.discount
	}
}

export const dashboardPlans: DashboardPlan[] = plans.map(toDashboardPlan)
export interface ComparisonFeature {
	name: string
	free: string | boolean
	pro: string | boolean
	team: string | boolean
}

export const comparisonFeatures: ComparisonFeature[] = [
	{
		name: 'Лимит ссылок',
		free: '10',
		pro: '1 000',
		team: 'Безлимит'
	},
	{
		name: 'Количество кликов',
		free: '1 000',
		pro: '100 000',
		team: 'Безлимит'
	},
	{
		name: 'Глубина аналитики',
		free: 'Базовая',
		pro: 'Расширенная',
		team: 'Расширенная'
	},
	{
		name: 'Экспорт QR',
		free: 'Стандарт',
		pro: 'High-res',
		team: 'High-res'
	},
	{
		name: 'Кастомный домен',
		free: false,
		pro: true,
		team: true
	},
	{
		name: 'Защита паролем',
		free: false,
		pro: true,
		team: true
	},
	{
		name: 'Командный доступ',
		free: false,
		pro: false,
		team: true
	},
	{
		name: 'API доступ',
		free: false,
		pro: false,
		team: true
	},
	{
		name: 'Уровень поддержки',
		free: 'Сообщество',
		pro: 'Приоритет',
		team: '24/7 Выделенная'
	}
]

export interface Testimonial {
	quote: string
	author: string
	role: string
	avatar: string
}

export const testimonials: Testimonial[] = [
	{
		quote: '"trim.ly сделал распространение ссылок кампаний невероятно простым. Аналитика — именно то, что мне было нужно."',
		author: 'Сара Дженкинс',
		role: 'Создатель на YouTube',
		avatar: ''
	},
	{
		quote: '"Кастомные QR-коды и брендинг полностью изменили то, как я делюсь ссылками на своё портфолио."',
		author: 'Маркус Чен',
		role: 'Фриланс-дизайнер',
		avatar: ''
	},
	{
		quote: '"Командная работа проходит безупречно. Мы отследили 50 тыс. кликов в первый месяц без единой проблемы."',
		author: 'Елена Родригес',
		role: 'Маркетинг-менеджер',
		avatar: ''
	}
]

interface FAQItem {
	question: string
	answer: string
}

export const faqItems: FAQItem[] = [
	{
		question: 'Могу ли я отменить подписку в любое время?',
		answer: 'Да, вы можете отменить подписку в любой момент. После отмены вы сохраните доступ до конца текущего расчётного периода.'
	},
	{
		question: 'Предоставляете ли вы возврат средств?',
		answer: 'Мы предоставляем полный возврат в течение 14 дней после оплаты, если вы не удовлетворены сервисом.'
	},
	{
		question: 'Есть ли бесплатный пробный период?',
		answer: 'Да, тариф Free полностью бесплатен и не требует карты. Вы также можете попробовать Pro бесплатно в течение 7 дней.'
	},
	{
		question: 'Какие способы оплаты вы принимаете?',
		answer: 'Для портфолио-проекта в демо-режиме оплата не требуется: вы можете переключать тарифы вручную.'
	},
	{
		question: 'Могу ли я изменить тариф позже?',
		answer: 'Да, вы можете повысить или понизить тариф в любое время. Изменения применяются сразу.'
	}
]
