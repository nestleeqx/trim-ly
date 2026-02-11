import DashboardLayout from '@/app/components/layout/DashboardLayout/DashboardLayout'
import { authOptions } from '@/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

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
