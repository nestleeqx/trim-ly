'use client'

import Button from '@/app/components/ui/Button'
import ClicksChart from '@/app/components/ui/ClicksChart'
import DashboardHeader from '@/app/components/ui/DashboardHeader'
import DevicesChart from '@/app/components/ui/DevicesChart'
import LinksFilters from '@/app/components/ui/LinksFilters/LinksFilters'
import LinksTable from '@/app/components/ui/LinksTable/LinksTable'
import StatsCards from '@/app/components/ui/StatsCards'
import { defaultStatsData } from '@/app/components/ui/StatsCards/stats.config'
import TopCountries from '@/app/components/ui/TopCountries'
import TopReferrers from '@/app/components/ui/TopReferrers'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import { mockLinks } from '@/data/mockLinks'
import useCsvExport from '@/hooks/useCsvExport'
import { convertStatsDataToCsv } from '@/utils/csvConverters'
import { useState } from 'react'
import { periods } from './analytics.config'
import styles from './page.module.scss'

export default function AnalyticsPage() {
	const [activePeriod, setActivePeriod] = useState('24h')

	const { downloadCsv } = useCsvExport(
		defaultStatsData,
		'analytics_stats',
		convertStatsDataToCsv
	)

	return (
		<>
			<DashboardHeader
				title='Аналитика'
				subtitle='Агрегированная статистика по всем вашим ссылкам.'
			/>

			<div className={styles.container}>
				<div className={styles.topRow}>
					<div className={styles.periods}>
						{periods.map(p => (
							<Button
								variant='reverseOutline'
								size='sm'
								key={p.key}
								className={`${styles.periodBtn} ${activePeriod === p.key ? styles.active : ''}`}
								onClick={() => setActivePeriod(p.key)}
							>
								{p.label}
							</Button>
						))}
					</div>
					<Button
						variant='invertGhost'
						size='md'
						onClick={() => downloadCsv()}
					>
						Экспорт CSV
					</Button>
				</div>
				<div className={styles.statsCardsWrapper}>
					<StatsCards clickable={false} />
				</div>
				<div className={styles.chartBlock}>
					<ClicksChart />
				</div>
				<div className={styles.filtersBlock}>
					<LinksFilters
						onFiltersChange={() => {}}
						hideRight
						showCountry
						showDevice
						showDate={false}
					/>
				</div>
				<div className={styles.sideCards}>
					<TopCountries countries={mockTopCountries} />
					<DevicesChart
						deviceStats={mockDeviceStats}
						mainPercentage={mockDeviceStats[0]?.percentage ?? 0}
						mainDeviceType={mockDeviceStats[0]?.type ?? 'Mobile'}
					/>
					<TopReferrers referrers={mockTopReferrers} />
				</div>
				<div className={styles.topLinksBlock}>
					<LinksTable
						title='Лучшие ссылки'
						allLinksHref='/links'
						links={mockLinks}
						selectedLinks={[]}
						onSelectAll={() => {}}
						onSelectLink={() => {}}
						allowSelection={false}
						showActions={false}
					/>
				</div>
			</div>
		</>
	)
}
