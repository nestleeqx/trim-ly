import Footer from '@/app/components/layout/Footer/Footer'
import Header from '@/app/components/layout/Header/Header'
import Analytics from '@/app/components/sections/Analytics/Analytics'
import CTA from '@/app/components/sections/CTA/CTA'
import FAQ from '@/app/components/sections/FAQ/FAQ'
import Features from '@/app/components/sections/Features/Features'
import Hero from '@/app/components/sections/Hero/Hero'
import Pricing from '@/app/components/sections/Pricing/Pricing'
import TrustedBy from '@/app/components/sections/TrustedBy/TrustedBy'
import ScrollToTop from '@/app/components/ui/ScrollToTop/ScrollToTop'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Главная',
	description:
		'Сокращайте ссылки, создавайте QR-коды и отслеживайте аналитику в одном сервисе.',
	alternates: {
		canonical: '/'
	},
	openGraph: {
		title: 'trim.ly — сокращатель ссылок с аналитикой',
		description:
			'Сокращайте ссылки, создавайте QR-коды и отслеживайте аналитику в одном сервисе.',
		url: '/'
	},
	twitter: {
		title: 'trim.ly — сокращатель ссылок с аналитикой',
		description:
			'Сокращайте ссылки, создавайте QR-коды и отслеживайте аналитику в одном сервисе.'
	}
}

export default function Home() {
	return (
		<>
			<Header />
			<Hero />
			<TrustedBy />
			<Features />
			<Analytics />
			<Pricing />
			<FAQ />
			<CTA />
			<Footer />
			<ScrollToTop />
		</>
	)
}
