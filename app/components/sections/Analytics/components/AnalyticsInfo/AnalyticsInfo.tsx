'use client'

import Button from '@/app/components/ui/Button/Button'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { checklistItems } from '../../analytics.config'
import styles from '../../Analytics.module.scss'

interface AnalyticsInfoProps {
	isAuthenticated: boolean
}

export default function AnalyticsInfo({ isAuthenticated }: AnalyticsInfoProps) {
	return (
		<motion.div
			className={styles.right}
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.6, delay: 0.2 }}
		>
			<span className={styles.badge}>АНАЛИТИКА</span>
			<h2 className={styles.title}>Узнайте, что работает</h2>
			<p className={styles.description}>
				Получите полную видимость эффективности ваших ссылок. Наша
				панель позволяет легко отслеживать тренды и оптимизировать
				стратегию.
			</p>

			<ul className={styles.checklist}>
				{checklistItems.map(item => (
					<li
						key={item}
						className={styles.checklistItem}
					>
						<Check
							size={20}
							className={styles.checkIcon}
						/>
						<span>{item}</span>
					</li>
				))}
			</ul>

			{!isAuthenticated && (
				<Link
					href='/signup'
					className={styles.link}
				>
					<Button
						variant='primary'
						size='lg'
					>
						Открыть аналитику
						<ArrowRight size={20} />
					</Button>
				</Link>
			)}
		</motion.div>
	)
}
