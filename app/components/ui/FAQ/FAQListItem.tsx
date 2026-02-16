'use client'

import cn from 'classnames'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { FAQItem } from './types'
import styles from './FAQ.module.scss'

interface FAQListItemProps {
	faq: FAQItem
	index: number
	isOpen: boolean
	useMotion: boolean
	onToggle: (index: number) => void
}

export default function FAQListItem({
	faq,
	index,
	isOpen,
	useMotion,
	onToggle
}: FAQListItemProps) {
	const className = cn(styles.item, { [styles.open]: isOpen })

	const content = (
		<>
			<button
				type='button'
				className={styles.question}
				onClick={() => onToggle(index)}
				aria-expanded={isOpen}
				aria-controls={`faq-answer-${index}`}
			>
				<span className={styles.questionText}>{faq.question}</span>
				<ChevronDown
					className={styles.icon}
					size={20}
					aria-hidden='true'
				/>
			</button>

			<div
				id={`faq-answer-${index}`}
				className={styles.answer}
				aria-hidden={!isOpen}
			>
				<div className={styles.answerInner}>
					<div className={styles.answerContent}>{faq.answer}</div>
				</div>
			</div>
		</>
	)

	if (!useMotion) {
		return <div className={className}>{content}</div>
	}

	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.35, delay: index * 0.04 }}
		>
			{content}
		</motion.div>
	)
}
