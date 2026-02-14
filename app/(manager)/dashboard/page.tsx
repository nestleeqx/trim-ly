'use client'

import styles from '@/app/(manager)/dashboard/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import {
	AnalyticsSideCardsSkeleton,
	AnalyticsStatsSkeleton
} from '@/app/components/ui/AnalyticsSkeleton/AnalyticsSkeleton'
import ClicksChart from '@/app/features/analytics/components/ClicksChart/ClicksChart'
import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import StatsCards from '@/app/features/analytics/components/StatsCards/StatsCards'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import EmptyDashboard from '@/app/features/dashboard/components/EmptyDashboard/EmptyDashboard'
import RecentLinks from '@/app/features/dashboard/components/RecentLinks/RecentLinks'
import { useAnalyticsBreakdown } from '@/hooks/analytics/useAnalyticsBreakdown'
import { useAnalyticsSummary } from '@/hooks/analytics/useAnalyticsSummary'

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
				{summary.isLoading ? (
					<AnalyticsStatsSkeleton
						className={styles.contentSkeleton}
					/>
				) : (
					<StatsCards
						data={summary.stats}
						clickable={false}
					/>
				)}

				<div className={styles.chartsGrid}>
					<div className={styles.chartsTop}>
						<ClicksChart />
						<RecentLinks />
					</div>
					<div className={styles.sideCharts}>
						{breakdown.isLoading ? (
							<AnalyticsSideCardsSkeleton
								className={styles.sideChartsSkeleton}
							/>
						) : (
							<>
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
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
