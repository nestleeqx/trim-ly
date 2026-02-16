export interface FAQItem {
	question: string
	answer: string
}

export interface FAQListProps {
	items: FAQItem[]
	initialOpenIndex?: number | null
	useMotion?: boolean
}
