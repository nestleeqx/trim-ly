import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Детали ссылки',
	description: 'Аналитика и редактирование выбранной ссылки.'
}

export default function LinkDetailsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
