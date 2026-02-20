'use client'

import { AnalyticsChartSkeleton } from '@/app/components/ui/AnalyticsSkeleton/AnalyticsSkeleton'
import ChartLoadingOverlay from '@/app/components/ui/ChartLoadingOverlay/ChartLoadingOverlay'
import ChartSummaryStats from '@/app/components/ui/ChartSummaryStats/ChartSummaryStats'
import PeriodSelector, {
	PeriodOption
} from '@/app/components/ui/PeriodSelector/PeriodSelector'
import { useAnalyticsClicks } from '@/app/features/analytics/hooks/useAnalyticsClicks'
import cn from 'classnames'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import ChartDatePicker from './ChartDatePicker/ChartDatePicker'
import styles from './ClicksChart.module.scss'
import type { RechartsAreaBundleProps } from './RechartsAreaBundle'

const RechartsAreaBundle = dynamic<RechartsAreaBundleProps>(
	() => import('./RechartsAreaBundle').then(m => m.default),
	{ ssr: false }
)

const periods: PeriodOption[] = [
	{ key: '24h', label: '24ч' },
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
]

export default function ClicksChart() {
	const {
		activePeriod,
		isLoading,
		isInitialLoading,
		isRefetching,
		error,
		chartData,
		chartPeriod,
		stats,
		showDatePicker,
		startDate,
		endDate,
		dateRangeError,
		handlePeriodChange,
		handleApplyCustomRange,
		handleCancelDatePicker,
		getCustomLabel,
		setStartDate,
		setEndDate,
		setDateRangeError
	} = useAnalyticsClicks()

	const { yAxisMax, yAxisTicks } = useMemo(() => {
		const maxValue = Math.max(0, ...chartData.map(d => d.value))
		const step =
			maxValue <= 20
				? 5
				: maxValue <= 100
					? 10
					: maxValue <= 500
						? 50
						: 500
		const max = Math.max(
			step * 2,
			Math.ceil((maxValue * 1.1) / step) * step
		)
		return {
			yAxisMax: max,
			yAxisTicks: Array.from({ length: 5 }, (_, i) =>
				Math.round((max / 4) * i)
			)
		}
	}, [chartData])

	const totalLabel = stats.total?.trim() ? stats.total : 'Нет данных'
	const averageLabel = stats.average?.trim() ? stats.average : 'Нет данных'

	if (isInitialLoading) {
		return <AnalyticsChartSkeleton />
	}

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.titleSection}>
					<h3 className={styles.title}>Клики по времени</h3>
					<p className={styles.subtitle}>
						Аналитика в реальном времени по всем вашим ссылкам
					</p>
				</div>

				<PeriodSelector
					options={periods}
					activeKey={activePeriod}
					onChange={key =>
						handlePeriodChange(
							key as '24h' | '7d' | '30d' | '90d' | 'custom'
						)
					}
					disabled={isLoading}
					getLabel={option =>
						option.key === 'custom'
							? getCustomLabel()
							: option.label
					}
				/>
			</div>

			<ChartDatePicker
				show={showDatePicker}
				startDate={startDate}
				endDate={endDate}
				error={dateRangeError}
				onStartDateChange={value => {
					setDateRangeError(null)
					setStartDate(value)
				}}
				onEndDateChange={value => {
					setDateRangeError(null)
					setEndDate(value)
				}}
				onApply={handleApplyCustomRange}
				onCancel={handleCancelDatePicker}
			/>

			{error ? <div className={styles.error}>{error}</div> : null}

			<div
				className={cn(styles.chartContainer, {
					[styles.chartContainerLoading]: isRefetching
				})}
			>
				{isRefetching ? <ChartLoadingOverlay /> : null}
				<RechartsAreaBundle
					data={chartData}
					yAxisMax={yAxisMax}
					yAxisTicks={yAxisTicks}
					isHourly={chartPeriod === '24h'}
				/>
			</div>

			<ChartSummaryStats
				total={totalLabel}
				average={averageLabel}
			/>
		</div>
	)
}
