import ClicksChart from '@/app/components/ui/ClicksChart'
import DevicesChart from '@/app/components/ui/DevicesChart'
import LinkStatsCards from '@/app/components/ui/LinkStatsCards'
import RawClickEvents from '@/app/components/ui/RawClickEvents'
import TopCountries from '@/app/components/ui/TopCountries'
import TopReferrers from '@/app/components/ui/TopReferrers'
import { mockClickEvents } from '@/data/mockClickEvents'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import styles from './LinkAnalytics.module.scss'

export const LinkAnalytics = () => {
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
