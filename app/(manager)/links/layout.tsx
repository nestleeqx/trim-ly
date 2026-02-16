import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Ссылки',
	description: 'Управление ссылками и фильтрами.'
}

export default function LinksLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
