'use client'

import styles from '@/app/(manager)/dashboard/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import {
	AnalyticsSideCardsSkeleton,
	AnalyticsStatsSkeleton
} from '@/app/components/ui/AnalyticsSkeleton/AnalyticsSkeleton'
import LoadingOverlay from '@/app/components/ui/LoadingOverlay/LoadingOverlay'
import StatsCards from '@/app/features/analytics/components/StatsCards/StatsCards'
import { useAnalyticsBreakdown } from '@/app/features/analytics/hooks/useAnalyticsBreakdown'
import { useAnalyticsSummary } from '@/app/features/analytics/hooks/useAnalyticsSummary'
import EmptyDashboard from '@/app/features/dashboard/components/EmptyDashboard/EmptyDashboard'
import dynamic from 'next/dynamic'

const ClicksChart = dynamic(
	() => import('@/app/features/analytics/components/ClicksChart/ClicksChart')
)
const DevicesChart = dynamic(
	() => import('@/app/features/analytics/components/DevicesChart/DevicesChart')
)
const TopCountries = dynamic(
	() => import('@/app/features/analytics/components/TopCountries/TopCountries')
)
const TopReferrers = dynamic(
	() => import('@/app/features/analytics/components/TopReferrers/TopReferrers')
)
const RecentLinks = dynamic(
	() => import('@/app/features/dashboard/components/RecentLinks/RecentLinks')
)

export default function DashboardPage() {
	const summary = useAnalyticsSummary('24h')
	const breakdown = useAnalyticsBreakdown({
		period: '24h',
		country: null,
		device: null,
		referrer: null
	})

	const activeLinksValue = Number(
		(summary.stats.find(item => item.id === 'links')?.value || '0')
			.toString()
			.replace(/[^\d]/g, '')
	)
	const hasLinks = activeLinksValue > 0

	if (!summary.isLoading && hasLinks === false) {
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
				{summary.isInitialLoading ? (
					<AnalyticsStatsSkeleton
						className={styles.contentSkeleton}
					/>
				) : (
					<div className={styles.loadingArea}>
						<StatsCards
							data={summary.stats}
							clickable={false}
						/>
						{summary.isRefetching ? <LoadingOverlay /> : null}
					</div>
				)}

				<div className={styles.chartsGrid}>
					<div className={styles.clicksBlock}>
						<ClicksChart />
					</div>
					<div className={styles.recentLinksBlock}>
						<RecentLinks />
					</div>
					<div className={styles.sideCharts}>
						{breakdown.isInitialLoading ? (
							<AnalyticsSideCardsSkeleton
								className={styles.sideChartsSkeleton}
							/>
						) : (
							<div className={styles.sideChartsContent}>
								<TopCountries
									countries={breakdown.topCountries}
								/>
								<DevicesChart
									deviceStats={breakdown.deviceStats}
									mainPercentage={
										breakdown.deviceStats[0]?.percentage ??
										0
									}
									mainDeviceType={
										breakdown.deviceStats[0]?.type ?? '-'
									}
								/>
								<TopReferrers
									referrers={breakdown.topReferrers}
								/>
								{breakdown.isRefetching ? (
									<LoadingOverlay />
								) : null}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
