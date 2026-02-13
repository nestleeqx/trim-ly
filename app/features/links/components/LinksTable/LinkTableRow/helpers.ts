export interface TrendData {
	value: number
	text: string
	className: 'positive' | 'negative' | 'neutral'
}

export const calculateTrend = (clicks: number): TrendData => {
	void clicks
	const trend = 0

	let className: 'positive' | 'negative' | 'neutral' = 'neutral'
	if (trend > 0) className = 'positive'
	else if (trend < 0) className = 'negative'

	const text = `${trend > 0 ? '+' : ''}${trend}%`

	return {
		value: trend,
		text,
		className
	}
}
