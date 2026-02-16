import DashboardLayout from '@/app/components/layout/DashboardLayout/DashboardLayout'
import { authOptions } from '@/auth'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: {
		default: 'Панель управления',
		template: '%s | Дашборд'
	},
	robots: {
		index: false,
		follow: false,
		noarchive: true
	}
}

export default async function DashboardRootLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await getServerSession(authOptions)

	if (!session) {
		redirect('/login?callbackUrl=/dashboard')
	}
	return <DashboardLayout>{children}</DashboardLayout>
}
