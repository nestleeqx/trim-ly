import '@/app/styles/globals.scss'
import { ThemeProvider } from '@/context/ThemeContext'
import AuthProvider from '@/providers/AuthProvider'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-inter'
})

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
	title: {
		default: 'trim.ly',
		template: '%s | trim.ly'
	},
	description:
		'Создавайте короткие ссылки, QR-коды и отслеживайте статистику переходов.',
	applicationName: 'trim.ly',
	robots: {
		index: true,
		follow: true
	},
	icons: {
		icon: '/favicon.ico',
		apple: '/apple-touch-icon.png'
	},
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		url: '/',
		siteName: 'trim.ly',
		title: 'trim.ly',
		description:
			'Создавайте короткие ссылки, QR-коды и отслеживайте статистику переходов.'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'trim.ly',
		description:
			'Создавайте короткие ссылки, QR-коды и отслеживайте статистику переходов.'
	}
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
	]
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body className={inter.variable}>
				<AuthProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	)
}
