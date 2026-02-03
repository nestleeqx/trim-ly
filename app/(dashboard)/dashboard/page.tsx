'use client'

import EmptyDashboard from '@/app/components/dashboard/EmptyDashboard/EmptyDashboard'
import ClicksChart from '../../components/dashboard/ClicksChart'
import DashboardHeader from '../../components/dashboard/DashboardHeader'
import DevicesChart from '../../components/dashboard/DevicesChart'
import RecentLinks from '../../components/dashboard/RecentLinks'
import StatsCards from '../../components/dashboard/StatsCards'
import TopCountries from '../../components/dashboard/TopCountries'
import TopReferrers from '../../components/dashboard/TopReferrers'
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
						<TopCountries />
						<DevicesChart />
						<TopReferrers />
					</div>
				</div>
			</div>
		</>
	)
}
