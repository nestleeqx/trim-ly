import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
	title: 'Дашборд',
	description: 'Обзор кликов, ссылок и источников трафика.',
	robots: {
		index: false,
		follow: false,
		noarchive: true
	},
	alternates: {
		canonical: '/dashboard'
	}
}

export default function DashboardPageLayout({
	children
}: {
	children: ReactNode
}) {
	return children
}
