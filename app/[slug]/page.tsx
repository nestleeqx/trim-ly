'use client'

import { LinkState, MOCK_LINKS } from '@/data/mockLinks'
import { Link as LinkIcon, ShieldCheck } from 'lucide-react'
import { useParams } from 'next/navigation'
import ErrorState from './ErrorState'
import ExpiredState from './ExpiredState'
import NotFoundState from './NotFoundState'
import styles from './page.module.scss'
import PasswordState from './PasswordState'
import PausedState from './PausedState'
import RedirectingState from './RedirectingState'

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
