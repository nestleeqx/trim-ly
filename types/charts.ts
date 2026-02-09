export interface ChartDataPoint {
	day: string
	date: string
	value: number
	unique: number
}

export interface TopCountry {
	code: string
	name: string
	clicks: number
	percentage: number
}

export interface TopReferrer {
	name: string
	clicks: number
}

export interface DeviceStats {
	type: string
	percentage: number
	color: string
}
