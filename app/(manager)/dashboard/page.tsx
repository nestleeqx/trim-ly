'use client'

import styles from '@/app/(manager)/dashboard/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import ClicksChart from '@/app/features/analytics/components/ClicksChart/ClicksChart'
import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import StatsCards from '@/app/features/analytics/components/StatsCards/StatsCards'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import EmptyDashboard from '@/app/features/dashboard/components/EmptyDashboard/EmptyDashboard'
import RecentLinks from '@/app/features/dashboard/components/RecentLinks/RecentLinks'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'

const hasLinks = true

export default function DashboardPage() {
	if (!hasLinks) {
		return (
			<>
				<DashboardHeader
					title='Дашборд'
					subtitle='Давайте создадим вашу первую ссылку.'
				/>
				<div className={styles.emptyWrapper}>
					<EmptyDashboard />
				</div>
			</>
		)
	}

	return (
		<>
			<DashboardHeader
				title='Дашборд'
				subtitle='С возвращением, вот что происходит.'
			/>
			<div className={styles.content}>
				<StatsCards />
				<div className={styles.chartsGrid}>
					<div className={styles.chartsTop}>
						<ClicksChart />
						<RecentLinks />
					</div>
					<div className={styles.sideCharts}>
						<TopCountries countries={mockTopCountries} />
						<DevicesChart
							deviceStats={mockDeviceStats}
							mainPercentage={mockDeviceStats[0]?.percentage ?? 0}
							mainDeviceType={
								mockDeviceStats[0]?.type ?? 'Mobile'
							}
						/>
						<TopReferrers referrers={mockTopReferrers} />
					</div>
				</div>
			</div>
		</>
	)
}
