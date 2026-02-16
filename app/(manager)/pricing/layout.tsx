import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Тарифы',
	description: 'Сравнение тарифов и выбор плана.'
}

export default function PricingLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
