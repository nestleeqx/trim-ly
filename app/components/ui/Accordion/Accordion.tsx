'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import React, { useState } from 'react'
import styles from './Accordion.module.scss'

interface AccordionProps {
	title: string
	icon?: React.ReactNode
	children: React.ReactNode
	initialOpen?: boolean
}

export default function Accordion({
	title,
	icon,
	children,
	initialOpen = false
}: AccordionProps) {
	const [isOpen, setIsOpen] = useState(initialOpen)

	const handleToggle = () => {
		setIsOpen(!isOpen)
	}

	return (
		<div className={styles.accordion}>
			<button
				type='button'
				className={styles.accordionHeader}
				onClick={handleToggle}
				aria-expanded={isOpen}
			>
				<span className={styles.accordionTitle}>
					{icon}
					{title}
				</span>
				{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</button>

			{isOpen && (
				<div className={styles.accordionContent}>{children}</div>
			)}
		</div>
	)
}
