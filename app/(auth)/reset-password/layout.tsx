import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Сброс пароля',
	description: 'Установите новый пароль для аккаунта.'
}

export default function ResetPasswordLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
