'use client'

import BillingToggle from '@/app/features/pricing/components/BillingToggle/BillingToggle'
import { motion } from 'framer-motion'
import styles from '../Pricing.module.scss'

interface PricingSectionHeaderProps {
	isYearly: boolean
	onToggle: (value: boolean) => void
}

export default function PricingSectionHeader({
	isYearly,
	onToggle
}: PricingSectionHeaderProps) {
	return (
		<motion.div
			className={styles.header}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ duration: 0.5 }}
		>
			<h2 className={styles.title}>Простые тарифы</h2>
			<p className={styles.subtitle}>Выберите план, который подходит для вашего роста.</p>
			<BillingToggle
				isYearly={isYearly}
				onToggle={onToggle}
			/>
		</motion.div>
	)
}

