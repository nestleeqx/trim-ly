'use client'

import EmptyDashboard from '@/app/components/dashboard/EmptyDashboard/EmptyDashboard'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import DevicesChart from '../../components/dashboard/DevicesChart'
import RecentLinks from '../../components/dashboard/RecentLinks'
import ClicksChart from '../../components/ui/ClicksChart'
import DashboardHeader from '../../components/ui/DashboardHeader'
import StatsCards from '../../components/ui/StatsCards'
import TopCountries from '../../components/ui/TopCountries'
import TopReferrers from '../../components/ui/TopReferrers'
import styles from './page.module.scss'

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
