export interface PlanFeature {
	text: string
}

export interface DashboardPlan {
	name: string
	description: string
	monthlyPrice: number
	yearlyPrice: number
	features: PlanFeature[]
	buttonText: string
	buttonVariant: 'primary' | 'outline'
	popular?: boolean
	isContact?: boolean
}

export const dashboardPlans: DashboardPlan[] = [
	{
		name: 'Free',
		description: 'Для личного использования',
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: [
			{ text: '100 ссылок' },
			{ text: 'Базовая аналитика' },
			{ text: 'QR-коды' }
		],
		buttonText: 'Начать бесплатно',
		buttonVariant: 'outline'
	},
	{
		name: 'Pro',
		description: 'Для фрилансеров и создателей контента',
		monthlyPrice: 12,
		yearlyPrice: 10,
		features: [
			{ text: 'Безлимитные ссылки' },
			{ text: 'Расширенная аналитика' },
			{ text: 'Кастомные алиасы' },
			{ text: 'Настройка QR-кодов' },
			{ text: 'Защита паролем' },
			{ text: 'UTM конструктор' }
		],
		buttonText: 'Перейти на Pro',
		buttonVariant: 'primary',
		popular: true
	},
	{
		name: 'Team',
		description: 'Для небольших команд',
		monthlyPrice: 29,
		yearlyPrice: 24,
		features: [
			{ text: 'Всё из Pro' },
			{ text: '5 участников включено' },
			{ text: 'Общие папки' },
			{ text: 'API доступ' },
			{ text: 'Командная аналитика' }
		],
		buttonText: 'Связаться с продажами',
		buttonVariant: 'outline',
		isContact: true
	}
]

export interface ComparisonFeature {
	name: string
	free: string | boolean
	pro: string | boolean
	team: string | boolean
}

export const comparisonFeatures: ComparisonFeature[] = [
	{
		name: 'Лимит ссылок',
		free: '100',
		pro: 'Безлимит',
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

export interface FAQItem {
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
		answer: 'Мы принимаем все основные банковские карты (Visa, Mastercard, Mir), а также PayPal и банковские переводы для корпоративных клиентов.'
	},
	{
		question: 'Могу ли я изменить тариф позже?',
		answer: 'Да, вы можете повысить или понизить тариф в любое время. Изменения вступят в силу сразу, а разница будет пропорционально рассчитана.'
	}
]
