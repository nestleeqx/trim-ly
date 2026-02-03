'use client'

import { Calendar } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'
import styles from './ClicksChart.module.scss'

const AreaChart = dynamic(
	() => import('recharts').then((mod) => mod.AreaChart),
	{ ssr: false }
)
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), {
	ssr: false
})
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), {
	ssr: false
})
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), {
	ssr: false
})
const CartesianGrid = dynamic(
	() => import('recharts').then((mod) => mod.CartesianGrid),
	{ ssr: false }
)
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), {
	ssr: false
})
const ResponsiveContainer = dynamic(
	() => import('recharts').then((mod) => mod.ResponsiveContainer),
	{ ssr: false }
)

type Period = '7d' | '30d' | '90d' | 'custom'

interface ChartDataPoint {
	day: string
	date: string
	value: number
	unique: number
}

// Mock data for different periods
const chartDataByPeriod: Record<Period, ChartDataPoint[]> = {
	'7d': [
		{ day: 'Пн', date: '27 янв', value: 480, unique: 320 },
		{ day: 'Вт', date: '28 янв', value: 620, unique: 410 },
		{ day: 'Ср', date: '29 янв', value: 580, unique: 390 },
		{ day: 'Чт', date: '30 янв', value: 890, unique: 620 },
		{ day: 'Пт', date: '31 янв', value: 1150, unique: 780 },
		{ day: 'Сб', date: '1 фев', value: 1050, unique: 720 },
		{ day: 'Вс', date: '2 фев', value: 1380, unique: 950 }
	],
	'30d': [
		{ day: '1 нед', date: '6-12 янв', value: 3200, unique: 2100 },
		{ day: '2 нед', date: '13-19 янв', value: 4100, unique: 2800 },
		{ day: '3 нед', date: '20-26 янв', value: 3800, unique: 2500 },
		{ day: '4 нед', date: '27 янв - 2 фев', value: 6150, unique: 4200 }
	],
	'90d': [
		{ day: 'Ноя', date: 'Ноябрь', value: 12400, unique: 8200 },
		{ day: 'Дек', date: 'Декабрь', value: 15800, unique: 10500 },
		{ day: 'Янв', date: 'Январь', value: 17250, unique: 11800 }
	],
	custom: [
		{ day: 'Пн', date: '27 янв', value: 480, unique: 320 },
		{ day: 'Вт', date: '28 янв', value: 620, unique: 410 },
		{ day: 'Ср', date: '29 янв', value: 580, unique: 390 },
		{ day: 'Чт', date: '30 янв', value: 890, unique: 620 },
		{ day: 'Пт', date: '31 янв', value: 1150, unique: 780 },
		{ day: 'Сб', date: '1 фев', value: 1050, unique: 720 },
		{ day: 'Вс', date: '2 фев', value: 1380, unique: 950 }
	]
}

const statsByPeriod: Record<Period, { total: string; average: string }> = {
	'7d': { total: '6 150', average: '879' },
	'30d': { total: '17 250', average: '575' },
	'90d': { total: '45 450', average: '505' },
	custom: { total: '6 150', average: '879' }
}

const periods: { key: Period; label: string }[] = [
	{ key: '7d', label: '7д' },
	{ key: '30d', label: '30д' },
	{ key: '90d', label: '90д' },
	{ key: 'custom', label: 'Период' }
]

interface CustomTooltipProps {
	active?: boolean
	payload?: Array<{ payload: ChartDataPoint }>
	label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
	active,
	payload
}) => {
	if (!active || !payload || !payload.length) return null

	const data = payload[0].payload

	return (
		<div className={styles.customTooltip}>
			<div className={styles.tooltipDate}>{data.date}</div>
			<div className={styles.tooltipRow}>
				<span className={styles.tooltipLabel}>Клики</span>
				<span className={`${styles.tooltipValue} ${styles.tooltipValuePrimary}`}>
					{data.value.toLocaleString()}
				</span>
			</div>
			<div className={styles.tooltipRow}>
				<span className={styles.tooltipLabel}>Уникальные</span>
				<span className={styles.tooltipValue}>{data.unique.toLocaleString()}</span>
			</div>
		</div>
	)
}

const ClicksChart: React.FC = () => {
	const [activePeriod, setActivePeriod] = useState<Period>('7d')
	const [isLoading, setIsLoading] = useState(false)
	const [showDatePicker, setShowDatePicker] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')

	const chartData = chartDataByPeriod[activePeriod]
	const stats = statsByPeriod[activePeriod]

	const handlePeriodChange = useCallback((period: Period) => {
		if (period === 'custom') {
			setShowDatePicker(true)
			return
		}

		setIsLoading(true)
		setActivePeriod(period)

		// Simulate data fetch
		setTimeout(() => {
			setIsLoading(false)
		}, 600)
	}, [])

	const handleApplyCustomRange = useCallback(() => {
		if (!startDate || !endDate) return

		setIsLoading(true)
		setActivePeriod('custom')
		setShowDatePicker(false)

		// Simulate data fetch
		setTimeout(() => {
			setIsLoading(false)
		}, 600)
	}, [startDate, endDate])

	const handleCancelDatePicker = useCallback(() => {
		setShowDatePicker(false)
		setStartDate('')
		setEndDate('')
	}, [])

	// Calculate Y axis domain based on data
	const maxValue = Math.max(...chartData.map((d) => d.value))
	const yAxisMax = Math.ceil(maxValue / 500) * 500 + 200
	const yAxisTicks = Array.from(
		{ length: 5 },
		(_, i) => Math.round((yAxisMax / 4) * i)
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
				<div className={styles.datePickerWrapper}>
					<div className={styles.periods}>
						{periods.map((period) => (
							<button
								key={period.key}
								className={`${styles.periodBtn} ${activePeriod === period.key ? styles.active : ''}`}
								onClick={() => handlePeriodChange(period.key)}
								disabled={isLoading}
							>
								{period.key === 'custom' && <Calendar size={14} />}
								{period.label}
							</button>
						))}
					</div>

					{showDatePicker && (
						<>
							<div
								className={styles.datePickerOverlay}
								onClick={handleCancelDatePicker}
							/>
							<div className={styles.datePicker}>
								<div className={styles.datePickerTitle}>Выберите период</div>
								<div className={styles.dateInputs}>
									<div className={styles.dateField}>
										<label className={styles.dateLabel}>Начало</label>
										<input
											type="date"
											className={styles.dateInput}
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
										/>
									</div>
									<div className={styles.dateField}>
										<label className={styles.dateLabel}>Конец</label>
										<input
											type="date"
											className={styles.dateInput}
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
										/>
									</div>
								</div>
								<div className={styles.datePickerActions}>
									<button
										className={`${styles.datePickerBtn} ${styles.datePickerBtnCancel}`}
										onClick={handleCancelDatePicker}
									>
										Отмена
									</button>
									<button
										className={`${styles.datePickerBtn} ${styles.datePickerBtnApply}`}
										onClick={handleApplyCustomRange}
										disabled={!startDate || !endDate}
									>
										Применить
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>

			<div className={styles.chartContainer}>
				{isLoading && (
					<div className={styles.loadingOverlay}>
						<div className={styles.spinner} />
					</div>
				)}
				<ResponsiveContainer width="100%" height="100%">
					<AreaChart
						data={chartData}
						margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
					>
						<defs>
							<linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
								<stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							stroke="#e5e7eb"
						/>
						<XAxis
							dataKey="day"
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
							type="monotone"
							dataKey="value"
							stroke="#4f46e5"
							strokeWidth={2}
							fillOpacity={1}
							fill="url(#colorValue)"
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
