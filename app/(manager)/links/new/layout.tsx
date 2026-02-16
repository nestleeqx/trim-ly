import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Создать ссылку',
	description: 'Создание новой короткой ссылки.'
}

export default function NewLinkLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
