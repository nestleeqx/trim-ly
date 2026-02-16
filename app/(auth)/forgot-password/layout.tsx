import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Восстановление пароля',
	description: 'Запросите письмо для восстановления пароля.'
}

export default function ForgotPasswordLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
