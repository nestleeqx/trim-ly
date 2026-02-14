'use client'

import DevicesChart from '@/app/features/analytics/components/DevicesChart/DevicesChart'
import TopCountries from '@/app/features/analytics/components/TopCountries/TopCountries'
import TopReferrers from '@/app/features/analytics/components/TopReferrers/TopReferrers'
import LinkAnalyticsSkeleton from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkAnalyticsSkeleton/LinkAnalyticsSkeleton'
import LinkClicksChart from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkClicksChart/LinkClicksChart'
import LinkStatsCards from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/LinkStatsCards/LinkStatsCards'
import RawClickEvents from '@/app/features/links/components/LinkDetails/LinkDetailsContent/LinkAnalytics/RawClickEvents/RawClickEvents'
import {
	LinkAnalyticsPeriod,
	useLinkAnalytics
} from '@/hooks/links/useLinkAnalytics'
import { useMemo, useState } from 'react'
import styles from './LinkAnalytics.module.scss'

interface LinkAnalyticsProps {
	linkId: string
}

function toInputDate(date: Date) {
	const y = date.getFullYear()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	return `${y}-${m}-${d}`
}

function formatLabelDate(value: string) {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return value
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short'
	})
}

export default function LinkAnalytics({ linkId }: LinkAnalyticsProps) {
	const [activePeriod, setActivePeriod] = useState<LinkAnalyticsPeriod>('30d')
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [startDate, setStartDate] = useState(() =>
		toInputDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
	)
	const [endDate, setEndDate] = useState(() => toInputDate(new Date()))
	const [customDateLabel, setCustomDateLabel] = useState('')
	const [dateRangeError, setDateRangeError] = useState<string | null>(null)

	const query = useMemo(
		() => ({
			period: activePeriod,
			from: activePeriod === 'custom' ? startDate : undefined,
			to: activePeriod === 'custom' ? endDate : undefined
		}),
		[activePeriod, startDate, endDate]
	)

	const { data, isLoading, error } = useLinkAnalytics(linkId, query)

	const isInitialLoading =
		isLoading &&
		!error &&
		data.chart.points.length === 0 &&
		data.rawEvents.length === 0

	const handlePeriodChange = (period: LinkAnalyticsPeriod) => {
		if (period === 'custom') {
			setDateRangeError(null)
			setShowDatePicker(true)
			return
		}

		setShowDatePicker(false)
		setDateRangeError(null)
		setActivePeriod(period)
		setCustomDateLabel('')
	}

	const handleApplyCustomRange = () => {
		if (!startDate || !endDate) return
		if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
			setDateRangeError('Дата начала не может быть позже даты окончания.')
			return
		}

		setDateRangeError(null)
		setCustomDateLabel(
			`${formatLabelDate(startDate)} — ${formatLabelDate(endDate)}`
		)
		setActivePeriod('custom')
		setShowDatePicker(false)
	}

	const handleCancelDatePicker = () => {
		setDateRangeError(null)
		setShowDatePicker(false)
	}

	const getCustomLabel = () => {
		if (customDateLabel) return customDateLabel
		return 'Период'
	}

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
				activePeriod={activePeriod}
				showDatePicker={showDatePicker}
				startDate={startDate}
				endDate={endDate}
				getCustomLabel={getCustomLabel}
				dateRangeError={dateRangeError}
				onPeriodChange={handlePeriodChange}
				onStartDateChange={value => {
					setDateRangeError(null)
					setStartDate(value)
				}}
				onEndDateChange={value => {
					setDateRangeError(null)
					setEndDate(value)
				}}
				onApplyCustomRange={handleApplyCustomRange}
				onCancelDatePicker={handleCancelDatePicker}
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
