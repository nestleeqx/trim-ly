'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import styles from './FAQ.module.scss'

export interface FAQItem {
	question: string
	answer: string
}

interface FAQListProps {
	items: FAQItem[]
	initialOpenIndex?: number | null
	useMotion?: boolean
}

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
			{items.map((faq, index) => {
				const isOpen = openIndex === index

				if (useMotion) {
					return (
						<motion.div
							key={index}
							className={`${styles.item} ${isOpen ? styles.open : ''}`}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.35, delay: index * 0.04 }}
						>
							<button
								type='button'
								className={styles.question}
								onClick={() => toggle(index)}
								aria-expanded={isOpen}
								aria-controls={`faq-answer-${index}`}
							>
								<span className={styles.questionText}>
									{faq.question}
								</span>
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
									<div className={styles.answerContent}>
										{faq.answer}
									</div>
								</div>
							</div>
						</motion.div>
					)
				}

				return (
					<div
						key={index}
						className={`${styles.item} ${isOpen ? styles.open : ''}`}
					>
						<button
							type='button'
							className={styles.question}
							onClick={() => toggle(index)}
							aria-expanded={isOpen}
							aria-controls={`faq-answer-${index}`}
						>
							<span className={styles.questionText}>
								{faq.question}
							</span>
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
								<div className={styles.answerContent}>
									{faq.answer}
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}
