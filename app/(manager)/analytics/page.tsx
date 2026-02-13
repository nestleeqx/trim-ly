'use client'

import styles from '@/app/(manager)/analytics/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Button from '@/app/components/ui/Button/Button'
import { periods } from '@/app/features/analytics/analytics.config'
import ClicksChart from '@/app/features/analytics/components/ClicksChart/ClicksChart'
import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import StatsCards from '@/app/features/analytics/components/StatsCards/StatsCards'
import { defaultStatsData } from '@/app/features/analytics/components/StatsCards/stats.config'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import LinksFilters from '@/app/features/links/components/LinksFilters/LinksFilters'
import LinksTable from '@/app/features/links/components/LinksTable/LinksTable'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import { mockLinks } from '@/data/mockLinks'
import useCsvExport from '@/hooks/useCsvExport'
import { convertStatsDataToCsv } from '@/utils/csvConverters'
import { useState } from 'react'

export default function AnalyticsPage() {
	const [activePeriod, setActivePeriod] = useState('24h')

	const { downloadCsv } = useCsvExport()

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
						onClick={() =>
							downloadCsv({
								data: defaultStatsData,
								filename: 'analytics_stats.csv',
								converter: convertStatsDataToCsv
							})
						}
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
