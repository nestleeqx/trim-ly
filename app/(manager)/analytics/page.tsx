'use client'

import DevicesChart from '@/app/components/dashboard/DevicesChart'
import LinksFilters from '@/app/components/dashboard/LinksFilters/LinksFilters'
import Button from '@/app/components/ui/Button'
import ClicksChart from '@/app/components/ui/ClicksChart'
import DashboardHeader from '@/app/components/ui/DashboardHeader'
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
import { useState } from 'react'
import styles from './page.module.scss'

const periods = [
	{ key: '24h', label: '24ч' },
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
]

const csvConverter = (data: typeof defaultStatsData) => {
	const headers = ['id', 'value', 'change']
	const escape = (v: any) => {
		if (v === null || v === undefined) return ''
		const s = String(v)
		if (s.includes(',') || s.includes('"') || s.includes('\n')) {
			return `"${s.replace(/"/g, '""')}"`
		}
		return s
	}

	const rows = data.map(d => [d.id, d.value, d.change])
	return [
		headers.map(escape).join(','),
		...rows.map(r => r.map(escape).join(','))
	].join('\n')
}

export default function AnalyticsPage() {
	const [activePeriod, setActivePeriod] = useState('24h')

	const { downloadCsv } = useCsvExport(
		defaultStatsData,
		'analytics_stats',
		csvConverter
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
					<StatsCards />
				</div>
				{/* Main clicks chart */}
				<div className={styles.chartBlock}>
					<ClicksChart />
				</div>

				{/* Filter bar (no right block on analytics page) */}
				<div className={styles.filtersBlock}>
					<LinksFilters
						onFiltersChange={() => {}}
						hideRight
						showCountry
						showDevice
						showDate={false}
					/>
				</div>

				{/* Side charts + top referrers */}
				<div className={styles.sideCards}>
					<TopCountries countries={mockTopCountries} />
					<DevicesChart
						deviceStats={mockDeviceStats}
						mainPercentage={mockDeviceStats[0]?.percentage ?? 0}
						mainDeviceType={mockDeviceStats[0]?.type ?? 'Mobile'}
					/>
					<TopReferrers referrers={mockTopReferrers} />
				</div>

				{/* Top performing links table */}
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

				{/* Summary stats cards */}
			</div>
		</>
	)
}
