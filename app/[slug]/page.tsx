'use client'

import styles from '@/app/[slug]/page.module.scss'
import ErrorState from '@/app/features/slug/components/ErrorState'
import ExpiredState from '@/app/features/slug/components/ExpiredState'
import NotFoundState from '@/app/features/slug/components/NotFoundState'
import PasswordState from '@/app/features/slug/components/PasswordState'
import PausedState from '@/app/features/slug/components/PausedState'
import RedirectingState from '@/app/features/slug/components/RedirectingState'
import { LinkState, MOCK_LINKS } from '@/data/mockLinks'
import { Link as LinkIcon, ShieldCheck } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function SlugPage() {
	const params = useParams()
	const slug = params.slug as string

	const linkData = MOCK_LINKS[slug] ?? {
		state: 'redirecting' as LinkState,
		destination: 'https://example.com/destination'
	}

	return (
		<div className={styles.page}>
			<div className={styles.logo}>
				<div className={styles.logoIcon}>
					<LinkIcon size={20} />
				</div>
				<span className={styles.logoText}>trim.ly</span>
			</div>
			{linkData.state === 'redirecting' && (
				<RedirectingState destination={linkData.destination} />
			)}
			{linkData.state === 'password' && <PasswordState />}
			{linkData.state === 'paused' && <PausedState />}
			{linkData.state === 'expired' && <ExpiredState />}
			{linkData.state === 'not-found' && <NotFoundState />}
			{linkData.state === 'error' && <ErrorState />}
			<div className={styles.footer}>
				<ShieldCheck size={14} />
				<span>Защищено trim.ly</span>
			</div>
		</div>
	)
}
