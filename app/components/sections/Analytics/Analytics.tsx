'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Period } from './analytics.config'
import styles from './Analytics.module.scss'
import AnalyticsDashboardPreview from './components/AnalyticsDashboardPreview/AnalyticsDashboardPreview'
import AnalyticsInfo from './components/AnalyticsInfo/AnalyticsInfo'

export default function Analytics() {
	const { status } = useSession()
	const [activePeriod, setActivePeriod] = useState<Period>('30d')

	return (
		<section
			className={styles.analytics}
			id='analytics'
		>
			<div className='container'>
				<div className={styles.content}>
					<AnalyticsDashboardPreview
						activePeriod={activePeriod}
						onPeriodChange={setActivePeriod}
					/>
					<AnalyticsInfo isAuthenticated={status === 'authenticated'} />
				</div>
			</div>
		</section>
	)
}

