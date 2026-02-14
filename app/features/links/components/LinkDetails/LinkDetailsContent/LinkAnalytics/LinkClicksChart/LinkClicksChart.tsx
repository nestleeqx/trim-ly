'use client'

import PeriodSelector, {
	PeriodOption
} from '@/app/components/ui/PeriodSelector/PeriodSelector'
import ChartDatePicker from '@/app/features/analytics/components/ClicksChart/ChartDatePicker/ChartDatePicker'
import RechartsAreaBundle from '@/app/features/analytics/components/ClicksChart/RechartsAreaBundle'
import { ChartDataPoint } from '@/types/charts'
import { useMemo } from 'react'
import styles from './LinkClicksChart.module.scss'

type LinkAnalyticsPeriod = '7d' | '30d' | '90d' | 'custom'

interface LinkClicksChartProps {
	data: ChartDataPoint[]
	total: string
	average: string
	isLoading: boolean
	activePeriod: LinkAnalyticsPeriod
	showDatePicker: boolean
	startDate: string
	endDate: string
	getCustomLabel: () => string
	dateRangeError?: string | null
	onPeriodChange: (period: LinkAnalyticsPeriod) => void
	onStartDateChange: (value: string) => void
	onEndDateChange: (value: string) => void
	onApplyCustomRange: () => void
	onCancelDatePicker: () => void
}

const periods: PeriodOption[] = [
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
]

export default function LinkClicksChart({
	data,
	total,
	average,
	isLoading,
	activePeriod,
	showDatePicker,
	startDate,
	endDate,
	getCustomLabel,
	dateRangeError,
	onPeriodChange,
	onStartDateChange,
	onEndDateChange,
	onApplyCustomRange,
	onCancelDatePicker
}: LinkClicksChartProps) {
	const { yAxisMax, yAxisTicks } = useMemo(() => {
		const maxValue = Math.max(0, ...data.map(d => d.value))

		const step =
			maxValue <= 20
				? 5
				: maxValue <= 100
					? 10
					: maxValue <= 500
						? 50
						: 500

		const max = Math.max(step * 2, Math.ceil((maxValue * 1.1) / step) * step)
		return {
			yAxisMax: max,
			yAxisTicks: Array.from({ length: 5 }, (_, i) =>
				Math.round((max / 4) * i)
			)
		}
	}, [data])

	const totalLabel = total?.trim() ? total : '0'
	const averageLabel = average?.trim() ? average : '0'

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div>
					<h3 className={styles.title}>Клики по ссылке</h3>
					<p className={styles.subtitle}>
						Динамика кликов и средние значения по выбранному периоду
					</p>
				</div>

				<PeriodSelector
					options={periods}
					activeKey={activePeriod}
					onChange={key =>
						onPeriodChange(key as '7d' | '30d' | '90d' | 'custom')
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
				onStartDateChange={onStartDateChange}
				onEndDateChange={onEndDateChange}
				onApply={onApplyCustomRange}
				onCancel={onCancelDatePicker}
			/>

			<div className={styles.chartContainer}>
				{isLoading ? (
					<div className={styles.loader}>Загрузка данных...</div>
				) : (
					<RechartsAreaBundle
						data={data}
						yAxisMax={yAxisMax}
						yAxisTicks={yAxisTicks}
					/>
				)}
			</div>

			<div className={styles.stats}>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>ВСЕГО КЛИКОВ</span>
					<span className={styles.statValue}>{totalLabel}</span>
				</div>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>СРЕДНЕЕ В ДЕНЬ</span>
					<span className={styles.statValue}>{averageLabel}</span>
				</div>
			</div>
		</div>
	)
}
