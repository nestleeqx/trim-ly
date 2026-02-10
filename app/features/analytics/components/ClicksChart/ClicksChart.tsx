'use client'

import useChartManager from '@/hooks/useChartManager'
import { Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import ChartDatePicker from './ChartDatePicker/ChartDatePicker'
import styles from './ClicksChart.module.scss'
import type { RechartsAreaBundleProps } from './RechartsAreaBundle'

const RechartsAreaBundle = dynamic<RechartsAreaBundleProps>(
	() => import('./RechartsAreaBundle').then(m => m.default),
	{ ssr: false }
)

const periods = [
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
] as const

export default function ClicksChart() {
	const {
		activePeriod,
		isLoading,
		chartData,
		stats,
		showDatePicker,
		startDate,
		endDate,
		handlePeriodChange,
		handleApplyCustomRange,
		handleCancelDatePicker,
		getCustomLabel,
		setStartDate,
		setEndDate
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

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<div className={styles.titleSection}>
					<h3 className={styles.title}>Клики по времени</h3>
					<p className={styles.subtitle}>
						Аналитика в реальном времени по всем ссылкам
					</p>
				</div>
				<div className={styles.periods}>
					{periods.map(({ key, label }) => (
						<button
							key={key}
							className={`${styles.periodBtn} ${activePeriod === key ? styles.active : ''}`}
							onClick={() => handlePeriodChange(key)}
							disabled={isLoading}
						>
							{key === 'custom' && <Calendar size={14} />}
							{key === 'custom' ? getCustomLabel() : label}
						</button>
					))}
				</div>
			</div>

			<ChartDatePicker
				show={showDatePicker}
				startDate={startDate}
				endDate={endDate}
				onStartDateChange={setStartDate}
				onEndDateChange={setEndDate}
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
					<span className={styles.statValue}>{stats.total}</span>
				</div>
				<div className={styles.stat}>
					<span className={styles.statLabel}>СРЕДНЕЕ В ДЕНЬ</span>
					<span className={styles.statValue}>{stats.average}</span>
				</div>
			</div>
		</div>
	)
}
