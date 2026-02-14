'use client'

import PeriodSelector, {
	PeriodOption
} from '@/app/components/ui/PeriodSelector/PeriodSelector'
import useChartManager from '@/hooks/useChartManager'
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
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
]

export default function ClicksChart() {
	const {
		activePeriod,
		isLoading,
		chartData,
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
	} = useChartManager('7d')

	const { yAxisMax, yAxisTicks } = useMemo(() => {
		const maxValue = Math.max(0, ...chartData.map(d => d.value))
		const max = Math.ceil(maxValue / 500) * 500 + 200
		return {
			yAxisMax: max,
			yAxisTicks: Array.from({ length: 5 }, (_, i) =>
				Math.round((max / 4) * i)
			)
		}
	}, [chartData])

	const totalLabel = stats.total?.trim() ? stats.total : 'Нет данных'
	const averageLabel = stats.average?.trim() ? stats.average : 'Нет данных'

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
						handlePeriodChange(key as '7d' | '30d' | '90d' | 'custom')
					}
					disabled={isLoading}
					getLabel={option =>
						option.key === 'custom' ? getCustomLabel() : option.label
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

			<div className={styles.chartContainer}>
				{isLoading && (
					<div className={styles.loadingOverlay}>
						<div className={styles.spinner} />
					</div>
				)}
				<RechartsAreaBundle
					data={chartData}
					yAxisMax={yAxisMax}
					yAxisTicks={yAxisTicks}
				/>
			</div>

			<div className={styles.stats}>
				<div className={styles.stat}>
					<span className={styles.statLabel}>ВСЕГО КЛИКОВ</span>
					<span className={styles.statValue}>{totalLabel}</span>
				</div>
				<div className={styles.stat}>
					<span className={styles.statLabel}>СРЕДНЕЕ В ДЕНЬ</span>
					<span className={styles.statValue}>{averageLabel}</span>
				</div>
			</div>
		</div>
	)
}
