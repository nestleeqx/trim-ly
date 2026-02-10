'use client'

import { TopReferrer } from '@/types/charts'
import styles from './TopReferrers.module.scss'

interface TopReferrersProps {
	referrers: TopReferrer[]
}

export default function TopReferrers({ referrers }: TopReferrersProps) {
	return (
		<div className={styles.card}>
			<h3 className={styles.title}>Топ источники</h3>
			<div className={styles.list}>
				{referrers.map(referrer => (
					<div
						key={referrer.name}
						className={styles.item}
					>
						<span className={styles.domain}>{referrer.name}</span>
						<span className={styles.clicks}>{referrer.clicks}</span>
					</div>
				))}
			</div>
		</div>
	)
}
