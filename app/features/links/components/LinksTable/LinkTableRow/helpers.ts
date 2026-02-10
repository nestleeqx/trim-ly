export interface TrendData {
	value: number
	text: string
	className: 'positive' | 'negative' | 'neutral'
}

export const calculateTrend = (clicks: number): TrendData => {
	const trend = (clicks % 21) - 10

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
