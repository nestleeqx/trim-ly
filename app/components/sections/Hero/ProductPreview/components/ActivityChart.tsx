import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import styles from '../ProductPreview.module.scss'
import { ChartDataPoint } from './preview.config'

interface ActivityChartProps {
	data: ChartDataPoint[]
	onAnalyticsClick: () => void
}

export default function ActivityChart({
	data,
	onAnalyticsClick
}: ActivityChartProps) {
	return (
		<div className={styles.chart}>
			<div className={styles.chartHeader}>
				<span>Последняя активность</span>
				<a
					href='#analytics'
					onClick={e => {
						e.preventDefault()
						onAnalyticsClick()
					}}
				>
					Полная аналитика →
				</a>
			</div>
			<ResponsiveContainer
				width='100%'
				height={150}
			>
				<LineChart
					data={data}
					margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
				>
					<CartesianGrid
						strokeDasharray='3 3'
						stroke='var(--color-border)'
					/>
					<XAxis
						dataKey='name'
						stroke='var(--color-text-secondary)'
						fontSize={12}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis hide />
					<Tooltip
						contentStyle={{
							backgroundColor: 'var(--color-bg)',
							border: '1px solid var(--color-border)',
							borderRadius: '8px',
							color: 'var(--color-text-primary)'
						}}
					/>
					<Line
						type='monotone'
						dataKey='clicks'
						stroke='#4f46e5'
						strokeWidth={2}
						dot={{
							r: 4,
							fill: '#4f46e5',
							strokeWidth: 2,
							stroke: '#fff'
						}}
						activeDot={{
							r: 6,
							fill: '#4f46e5',
							stroke: '#fff',
							strokeWidth: 2
						}}
						animationDuration={2000}
						animationEasing='ease-out'
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}
