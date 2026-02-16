import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Аналитика',
	description: 'Сводная аналитика по ссылкам.'
}

export default function AnalyticsLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
