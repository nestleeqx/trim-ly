import ClicksChart from '@/app/features/analytics/components/ClicksChart/ClicksChart'
import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import LinkStatsCards from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkStatsCards/LinkStatsCards'
import RawClickEvents from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/RawClickEvents/RawClickEvents'
import { mockClickEvents } from '@/data/mockClickEvents'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import styles from './LinkAnalytics.module.scss'

export default function LinkAnalytics() {
	return (
		<>
			<LinkStatsCards />
			<ClicksChart />
			<div className={styles.sideCharts}>
				<TopCountries countries={mockTopCountries} />
				<DevicesChart
					deviceStats={mockDeviceStats}
					mainPercentage={mockDeviceStats[0]?.percentage ?? 0}
					mainDeviceType={mockDeviceStats[0]?.type ?? 'Mobile'}
				/>
				<TopReferrers referrers={mockTopReferrers} />
			</div>
			<RawClickEvents events={mockClickEvents} />
		</>
	)
}
