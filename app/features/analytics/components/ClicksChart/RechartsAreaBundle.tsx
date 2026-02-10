'use client'

import CustomTooltip from '@/app/components/ui/CustomTooltip/CustomTooltip'
import { ChartDataPoint } from '@/types/charts'
import { useId } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'

export interface RechartsAreaBundleProps {
	data: ChartDataPoint[]
	yAxisMax: number
	yAxisTicks: number[]
}

export default function RechartsAreaBundle({
	data,
	yAxisMax,
	yAxisTicks
}: RechartsAreaBundleProps) {
	const gradientId = useId()

	return (
		<ResponsiveContainer
			width='100%'
			height='100%'
		>
			<AreaChart
				data={data}
				margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
			>
				<defs>
					<linearGradient
						id={gradientId}
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
	)
}
