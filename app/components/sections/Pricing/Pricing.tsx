'use client'

import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import BillingToggle from '../../ui/BillingToggle/BillingToggle'
import ContactForm from '../../ui/ContactForm'
import Modal from '../../ui/Modal'
import PlanCard from '../../ui/PlanCard/PlanCard'
import styles from './Pricing.module.scss'
import { plans } from './pricing.config'

const Pricing: React.FC = () => {
	const [isContactModalOpen, setContactModalOpen] = useState(false)
	const [isYearly, setIsYearly] = useState(false)

	const openContactModal = useCallback(() => setContactModalOpen(true), [])
	const closeContactModal = useCallback(() => setContactModalOpen(false), [])

	return (
		<section
			className={styles.pricing}
			id='pricing'
		>
			<div className='container'>
				<motion.div
					className={styles.header}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.5 }}
				>
					<h2 className={styles.title}>Простые тарифы</h2>
					<p className={styles.subtitle}>
						Выберите план, который подходит для вашего роста.
					</p>
					<BillingToggle
						isYearly={isYearly}
						onToggle={setIsYearly}
					/>
				</motion.div>

				<div className={styles.grid}>
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<PlanCard
								plan={plan}
								isYearly={isYearly}
								onContactClick={openContactModal}
							/>
						</motion.div>
					))}
				</div>
			</div>

			<Modal
				isOpen={isContactModalOpen}
				onClose={closeContactModal}
				title='Связаться с отделом продаж'
			>
				<ContactForm />
			</Modal>
		</section>
	)
}

export default Pricing
