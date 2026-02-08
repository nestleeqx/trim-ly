'use client'

import { Period } from '@/data/mockCharts'
import useChartManager from '@/hooks/useChartManager'
import { Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import React from 'react'
import ChartDatePicker from '../ChartDatePicker'
import CustomTooltip from '../CustomTooltip'
import styles from './ClicksChart.module.scss'

const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), {
	ssr: false
})
const Area = dynamic(() => import('recharts').then(mod => mod.Area), {
	ssr: false
})
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), {
	ssr: false
})
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), {
	ssr: false
})
const CartesianGrid = dynamic(
	() => import('recharts').then(mod => mod.CartesianGrid),
	{ ssr: false }
)
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), {
	ssr: false
})
const ResponsiveContainer = dynamic(
	() => import('recharts').then(mod => mod.ResponsiveContainer),
	{ ssr: false }
)

const periods: { key: Period; label: string }[] = [
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
]

const ClicksChart: React.FC = () => {
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

	const maxValue = Math.max(...chartData.map(d => d.value))
	const yAxisMax = Math.ceil(maxValue / 500) * 500 + 200
	const yAxisTicks = Array.from({ length: 5 }, (_, i) =>
		Math.round((yAxisMax / 4) * i)
	)

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
					{periods.map(period => (
						<button
							key={period.key}
							className={`${styles.periodBtn} ${activePeriod === period.key ? styles.active : ''}`}
							onClick={() => handlePeriodChange(period.key)}
							disabled={isLoading}
						>
							{period.key === 'custom' && <Calendar size={14} />}
							{period.key === 'custom'
								? getCustomLabel()
								: period.label}
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
				<ResponsiveContainer
					width='100%'
					height='100%'
				>
					<AreaChart
						data={chartData}
						margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
					>
						<defs>
							<linearGradient
								id='colorValue'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop
									offset='5%'
									stopColor='#4f46e5'
									stopOpacity={0.3}
								/>
								<stop
									offset='95%'
									stopColor='#4f46e5'
									stopOpacity={0.02}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray='3 3'
							vertical={false}
							stroke='#e5e7eb'
						/>
						<XAxis
							dataKey='day'
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#6b7280', fontSize: 12 }}
							dy={10}
						/>
						<YAxis
							axisLine={false}
							tickLine={false}
							tick={{ fill: '#6b7280', fontSize: 12 }}
							dx={-10}
							domain={[0, yAxisMax]}
							ticks={yAxisTicks}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type='monotone'
							dataKey='value'
							stroke='#4f46e5'
							strokeWidth={2}
							fillOpacity={1}
							fill='url(#colorValue)'
							dot={{
								r: 4,
								fill: '#fff',
								stroke: '#4f46e5',
								strokeWidth: 2
							}}
							activeDot={{
								r: 6,
								fill: '#4f46e5',
								stroke: '#fff',
								strokeWidth: 2
							}}
						/>
					</AreaChart>
				</ResponsiveContainer>
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

export default ClicksChart
