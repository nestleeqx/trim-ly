import { DeviceStats } from '@/types/charts'

export const DEVICE_CHART_CONFIG = {
	radius: 80,
	strokeWidth: 20,
	viewBox: '0 0 200 200',
	cx: 100,
	cy: 100
}

export interface ChartSegment extends DeviceStats {
	index: number
	strokeDasharray: string
	strokeDashoffset: string
}

export const calculateSegments = (
	deviceStats: DeviceStats[]
): ChartSegment[] => {
	const circumference = 2 * Math.PI * DEVICE_CHART_CONFIG.radius
	let cumulativePercentage = 0

	return deviceStats.map((device, index) => {
		const strokeDasharray = `${
			(device.percentage / 100) * circumference
		} ${circumference}`
		const strokeDashoffset = -((cumulativePercentage / 100) * circumference)
		cumulativePercentage += device.percentage

		return {
			...device,
			index,
			strokeDasharray,
			strokeDashoffset
		}
	})
}
