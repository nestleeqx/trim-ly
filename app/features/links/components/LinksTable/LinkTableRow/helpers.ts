interface TrendData {
	value: number
	text: string
	className: 'positive' | 'negative' | 'neutral'
}

export const calculateTrend = (rawTrend: number): TrendData => {
	const trend = Number.isFinite(rawTrend) ? Math.round(rawTrend) : 0

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
