'use client'

import { useState } from 'react'
import FAQListItem from './FAQListItem'
import type { FAQListProps, FAQItem } from './types'
import styles from './FAQ.module.scss'

export type { FAQItem }

export default function FAQList({
	items,
	initialOpenIndex = 0,
	useMotion = false
}: FAQListProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(initialOpenIndex)

	const toggle = (index: number) => {
		setOpenIndex(prev => (prev === index ? null : index))
	}

	return (
		<div
			className={styles.accordion}
			role='region'
			aria-label='FAQ list'
		>
			{items.map((faq, index) => (
				<FAQListItem
					key={index}
					faq={faq}
					index={index}
					isOpen={openIndex === index}
					useMotion={useMotion}
					onToggle={toggle}
				/>
			))}
		</div>
	)
}
