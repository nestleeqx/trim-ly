export interface UsageMetric {
	label: string
	current: string
	total: string
	percentage: number
	variant?: 'default' | 'alt'
}
