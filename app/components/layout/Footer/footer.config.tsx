export interface FooterLink {
	label: string
	href: string
	isModal?: boolean
}

export interface FooterSection {
	title: string
	links: FooterLink[]
}

export const footerSections: Record<string, FooterSection> = {
	product: {
		title: 'Продукт',
		links: [
			{ label: 'Возможности', href: '#features' },
			{ label: 'Тарифы', href: '#pricing' },
			{ label: 'История изменений', href: '#' },
			{ label: 'Расширения', href: '#' }
		]
	},
	company: {
		title: 'Компания',
		links: [
			{ label: 'О нас', href: '#' },
			{ label: 'Блог', href: '#' },
			{ label: 'Карьера', href: '#' },
			{ label: 'Контакты', href: '#', isModal: true }
		]
	},
	support: {
		title: 'Поддержка',
		links: [
			{ label: 'Центр помощи', href: '#' },
			{ label: 'API Документация', href: '#' },
			{ label: 'Статус', href: '#' },
			{ label: 'Сообщество', href: '#' }
		]
	},
	legal: {
		title: 'Правовая информация',
		links: [
			{ label: 'Политика конфиденциальности', href: '#' },
			{ label: 'Условия использования', href: '#' },
			{ label: 'Cookies', href: '#' }
		]
	}
}

export const bottomLinks = [
	{ label: 'Безопасность', href: '#' },
	{ label: 'Карта сайта', href: '#' }
]
