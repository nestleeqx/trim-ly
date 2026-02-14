'use client'

import styles from '@/app/(manager)/analytics/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import {
	AnalyticsSideCardsSkeleton,
	AnalyticsStatsSkeleton,
	AnalyticsTableSkeleton
} from '@/app/components/ui/AnalyticsSkeleton/AnalyticsSkeleton'
import Button from '@/app/components/ui/Button/Button'
import LoadingOverlay from '@/app/components/ui/LoadingOverlay/LoadingOverlay'
import { periods } from '@/app/features/analytics/analytics.config'
import ClicksChart from '@/app/features/analytics/components/ClicksChart/ClicksChart'
import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import StatsCards from '@/app/features/analytics/components/StatsCards/StatsCards'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import LinksFilters from '@/app/features/links/components/LinksFilters/LinksFilters'
import LinksTable from '@/app/features/links/components/LinksTable/LinksTable'
import { useAnalyticsBreakdown } from '@/hooks/analytics/useAnalyticsBreakdown'
import { useAnalyticsSummary } from '@/hooks/analytics/useAnalyticsSummary'
import { useAnalyticsTopLinks } from '@/hooks/analytics/useAnalyticsTopLinks'
import useCsvExport from '@/hooks/useCsvExport'
import { convertStatsDataToCsv } from '@/utils/csvConverters'
import { useMemo, useState } from 'react'

type DashboardPeriod = '24h' | '7d' | '30d' | '90d'

export default function AnalyticsPage() {
	const [activePeriod, setActivePeriod] = useState<DashboardPeriod>('24h')
	const [analyticsFilters, setAnalyticsFilters] = useState<{
		country: string | null
		device: string | null
		referrer: string | null
	}>({
		country: null,
		device: null,
		referrer: null
	})

	const summary = useAnalyticsSummary(activePeriod)
	const breakdown = useAnalyticsBreakdown({
		period: activePeriod,
		...analyticsFilters
	})
	const topLinks = useAnalyticsTopLinks({
		period: activePeriod,
		...analyticsFilters
	})
	const { downloadCsv } = useCsvExport()

	const filterError = useMemo(() => breakdown.error ?? null, [breakdown.error])
	const topLinksError = useMemo(() => topLinks.error ?? null, [topLinks.error])
	const periodOptions = useMemo(
		() => periods.filter(p => p.key !== 'custom') as Array<{
			key: DashboardPeriod
			label: string
		}>,
		[]
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
						{periodOptions.map(p => (
							<Button
								variant='reverseOutline'
								size='sm'
								key={p.key}
								className={`${styles.periodBtn} ${activePeriod === p.key ? styles.active : ''}`}
								onClick={() => setActivePeriod(p.key)}
								title={`Период ${p.label}`}
							>
								{p.label}
							</Button>
						))}
					</div>
					<Button
						variant='invertGhost'
						size='md'
						disabled={summary.isLoading || !!summary.error}
						onClick={() =>
							downloadCsv({
								data: summary.stats,
								filename: `analytics_stats_${activePeriod}.csv`,
								converter: convertStatsDataToCsv
							})
						}
					>
						Экспорт CSV
					</Button>
				</div>

				{summary.error ? <p>{summary.error}</p> : null}

				<div className={styles.statsCardsWrapper}>
					{summary.isLoading ? (
						<AnalyticsStatsSkeleton />
					) : (
						<StatsCards
							data={summary.stats}
							clickable={false}
						/>
					)}
				</div>

				<div className={styles.chartBlock}>
					<ClicksChart />
				</div>

				<div className={styles.filtersBlock}>
					<LinksFilters
						onFiltersChange={filters =>
							setAnalyticsFilters({
								country: filters.country ?? null,
								device: filters.device ?? null,
								referrer: filters.referrer ?? null
							})
						}
						hideRight
						showCountry
						showDevice
						showReferrer
						showDate={false}
						showStatus={false}
						showTags={false}
						availableCountries={breakdown.availableCountries}
						availableDevices={breakdown.availableDevices}
						availableReferrers={breakdown.availableReferrers}
					/>
				</div>

				{filterError ? <p>{filterError}</p> : null}

				<div className={styles.sideCards}>
					{breakdown.isLoading ? (
						<AnalyticsSideCardsSkeleton className={styles.sideCardsSkeleton} />
					) : (
						<>
							<TopCountries countries={breakdown.topCountries} />
							<DevicesChart
								deviceStats={breakdown.deviceStats}
								mainPercentage={breakdown.deviceStats[0]?.percentage ?? 0}
								mainDeviceType={breakdown.deviceStats[0]?.type ?? '-'}
							/>
							<TopReferrers referrers={breakdown.topReferrers} />
						</>
					)}
				</div>

				{topLinksError ? <p>{topLinksError}</p> : null}

				<div className={styles.topLinksBlock}>
					{topLinks.isInitialLoading ? (
						<AnalyticsTableSkeleton rows={6} />
					) : (
						<div className={styles.topLinksContent}>
							<LinksTable
								title='Лучшие ссылки'
								allLinksHref='/links'
								links={topLinks.links}
								selectedLinks={[]}
								onSelectAll={() => {}}
								onSelectLink={() => {}}
								allowSelection={false}
								showActions={false}
								showTrend={false}
							/>
							{topLinks.isRefetching ? <LoadingOverlay /> : null}
						</div>
					)}
				</div>
			</div>
		</>
	)
}
