'use client'

import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import LinkAnalyticsSkeleton from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkAnalyticsSkeleton/LinkAnalyticsSkeleton'
import LinkClicksChart from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkClicksChart/LinkClicksChart'
import LinkStatsCards from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkStatsCards/LinkStatsCards'
import RawClickEvents from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/RawClickEvents/RawClickEvents'
import { useLinkAnalytics } from '@/app/features/links/hooks/useLinkAnalytics'
import useLinkAnalyticsPeriod from './hooks/useLinkAnalyticsPeriod'
import styles from './LinkAnalytics.module.scss'

interface LinkAnalyticsProps {
	linkId: string
}

export default function LinkAnalytics({ linkId }: LinkAnalyticsProps) {
	const period = useLinkAnalyticsPeriod()
	const { data, isLoading, error } = useLinkAnalytics(linkId, period.query)

	const isInitialLoading =
		isLoading &&
		!error &&
		data.chart.points.length === 0 &&
		data.rawEvents.length === 0

	if (isInitialLoading) {
		return <LinkAnalyticsSkeleton />
	}

	return (
		<>
			<LinkStatsCards data={data.statsCards} />

			{error ? <div className={styles.error}>{error}</div> : null}

			<LinkClicksChart
				data={data.chart.points}
				total={data.chart.total}
				average={data.chart.average}
				isLoading={isLoading}
				activePeriod={period.activePeriod}
				showDatePicker={period.showDatePicker}
				startDate={period.startDate}
				endDate={period.endDate}
				getCustomLabel={period.getCustomLabel}
				dateRangeError={period.dateRangeError}
				onPeriodChange={period.onPeriodChange}
				onStartDateChange={period.onStartDateChange}
				onEndDateChange={period.onEndDateChange}
				onApplyCustomRange={period.onApplyCustomRange}
				onCancelDatePicker={period.onCancelDatePicker}
			/>

			<div className={styles.sideCharts}>
				<TopCountries countries={data.topCountries} />
				<DevicesChart
					deviceStats={data.deviceStats}
					mainPercentage={data.deviceStats[0]?.percentage ?? 0}
					mainDeviceType={data.deviceStats[0]?.type ?? '-'}
				/>
				<TopReferrers referrers={data.topReferrers} />
			</div>

			<RawClickEvents
				events={data.rawEvents}
				isLoading={isLoading}
			/>
		</>
	)
}
