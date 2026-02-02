import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import TrustedBy from './components/sections/TrustedBy';
import Features from './components/sections/Features';
import Analytics from './components/sections/Analytics';
import Pricing from './components/sections/Pricing';

export default function Home() {
	return (
		<>
			<Header />
			<Hero />
			<TrustedBy />
			<Features />
			<Analytics />
			<Pricing />
		</>
	);
}
