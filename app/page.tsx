import Footer from './components/layout/Footer/Footer'
import Header from './components/layout/Header'
import Analytics from './components/sections/Analytics'
import CTA from './components/sections/CTA/CTA'
import FAQ from './components/sections/FAQ/FAQ'
import Features from './components/sections/Features'
import Hero from './components/sections/Hero'
import Pricing from './components/sections/Pricing'
import TrustedBy from './components/sections/TrustedBy'
import ScrollToTop from './components/ui/ScrollToTop'

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
