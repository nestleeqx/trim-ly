import DashboardLayout from '@/app/components/layout/DashboardLayout/DashboardLayout'

export default function DashboardRootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return <DashboardLayout>{children}</DashboardLayout>
}
