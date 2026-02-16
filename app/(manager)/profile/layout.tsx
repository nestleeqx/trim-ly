import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Профиль',
	description: 'Настройки профиля, безопасности и подписки.'
}

export default function ProfileLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
