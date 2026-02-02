import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/ThemeContext'
import './styles/globals.scss'

const inter = Inter({
	subsets: ['latin', 'cyrillic'],
	variable: '--font-inter'
})

export const metadata: Metadata = {
	title: 'trim.ly - Сокращайте ссылки умнее',
	description:
		'Создавайте брендированные короткие ссылки, генерируйте QR-коды и анализируйте эффективность с помощью аналитики в реальном времени.'
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
