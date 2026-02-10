import '@/app/styles/globals.scss'
import { ThemeProvider } from '@/context/ThemeContext'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-inter'
})

export const metadata: Metadata = {
	title: 'Сокращайте ссылки умнее - trim.ly',
	description:
		'Создавайте брендированные короткие ссылки, генерируйте QR-коды и анализируйте эффективность с помощью аналитики в реальном времени.',
	keywords: [
		'сокращение ссылок',
		'короткие ссылки',
		'QR-коды',
		'аналитика ссылок',
		'брендированные ссылки',
		'link shortener',
		'URL shortener'
	],
	authors: [{ name: 'trim.ly' }],
	creator: 'trim.ly',
	publisher: 'trim.ly',
	robots: {
		index: true,
		follow: true
	},
	openGraph: {
		type: 'website',
		locale: 'ru_RU',
		url: 'https://trim.ly',
		siteName: 'trim.ly',
		title: 'Сокращайте ссылки умнее - trim.ly',
		description:
			'Создавайте брендированные короткие ссылки, генерируйте QR-коды и анализируйте эффективность с помощью аналитики в реальном времени.'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Сокращайте ссылки умнее - trim.ly',
		description:
			'Создавайте брендированные короткие ссылки, генерируйте QR-коды и анализируйте эффективность с помощью аналитики в реальном времени.'
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
		<html
			lang='ru'
			suppressHydrationWarning
		>
			<body className={inter.variable}>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	)
}
