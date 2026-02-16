import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Дашборд',
	description: 'Ключевые показатели и последние ссылки.'
}

export default function DashboardPageLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
