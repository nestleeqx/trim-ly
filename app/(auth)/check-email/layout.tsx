import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Проверьте почту',
	description: 'Статус отправки письма для восстановления пароля.'
}

export default function CheckEmailLayout({
	children
}: {
	children: React.ReactNode
}) {
	return children
}
