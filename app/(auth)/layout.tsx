import { authOptions } from '@/auth'
import { getServerSession } from 'next-auth'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: {
		default: 'Авторизация',
		template: '%s | Авторизация'
	},
	robots: {
		index: false,
		follow: false,
		noarchive: true
	}
}

export default async function AuthLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)

	if (session) redirect('/dashboard')
	return <>{children}</>
}
