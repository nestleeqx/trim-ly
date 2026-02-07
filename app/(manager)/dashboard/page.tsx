'use client'

import EmptyDashboard from '@/app/components/dashboard/EmptyDashboard/EmptyDashboard'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import { useState } from 'react'
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
	const [searchQuery, setSearchQuery] = useState('')
	const handleSearch = (value: string) => {
		console.log(value)
	}

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
				search={{
					value: searchQuery,
					onChange: setSearchQuery,
					onSearch: handleSearch,
					placeholder: 'Поиск...'
				}}
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
