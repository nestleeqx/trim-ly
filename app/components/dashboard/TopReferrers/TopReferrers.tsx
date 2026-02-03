'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import styles from './TopReferrers.module.scss'

interface Referrer {
	domain: string
	clicks: string
}

const referrers: Referrer[] = [
	{ domain: 'instagram.com', clicks: '4.2k' },
	{ domain: 'twitter.com', clicks: '2.8k' },
	{ domain: 't.co', clicks: '1.9k' },
	{ domain: 'direct', clicks: '1.2k' },
	{ domain: 'facebook.com', clicks: '0.8k' }
]

const TopReferrers: React.FC = () => {
	const router = useRouter()

	const handleReferrerClick = (domain: string) => {
		router.push(`/analytics?referrer=${encodeURIComponent(domain)}`)
	}

	return (
		<div className={styles.card}>
			<h3 className={styles.title}>Топ источники</h3>
			<div className={styles.list}>
				{referrers.map(referrer => (
					<div
						key={referrer.domain}
						className={styles.item}
						onClick={() => handleReferrerClick(referrer.domain)}
						role='button'
						tabIndex={0}
						onKeyDown={e => {
							if (e.key === 'Enter' || e.key === ' ') {
								handleReferrerClick(referrer.domain)
							}
						}}
						title={`Фильтр по ${referrer.domain}`}
					>
						<span className={styles.domain}>{referrer.domain}</span>
						<span className={styles.clicks}>{referrer.clicks}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default TopReferrers
