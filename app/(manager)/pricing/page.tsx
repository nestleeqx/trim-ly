'use client'

import ContactForm from '@/app/components/ui/ContactForm'
import DashboardHeader from '@/app/components/ui/DashboardHeader'
import Modal from '@/app/components/ui/Modal'
import { useCallback, useState } from 'react'
import { ComparisonTable } from './ComparisonTable'
import { FAQSection } from './FAQSection'
import styles from './page.module.scss'
import { PlanCardsGrid } from './PlanCardsGrid'
import { PricingHeader } from './PricingHeader'
import { TestimonialsGrid } from './TestimonialsGrid'

export default function PricingPage() {
	const [isYearly, setIsYearly] = useState(false)
	const [isContactModalOpen, setContactModalOpen] = useState(false)
	const openContactModal = useCallback(() => setContactModalOpen(true), [])
	const closeContactModal = useCallback(() => setContactModalOpen(false), [])

	return (
		<>
			<DashboardHeader
				title='Pricing'
				subtitle='Обзор вашего аккаунта.'
				showCreateButton={true}
			/>
			<div className={styles.content}>
				<PricingHeader
					isYearly={isYearly}
					onToggle={setIsYearly}
				/>
				<PlanCardsGrid
					isYearly={isYearly}
					onContactClick={openContactModal}
				/>
				<ComparisonTable />
				<TestimonialsGrid />
				<FAQSection />
			</div>
			<Modal
				isOpen={isContactModalOpen}
				onClose={closeContactModal}
				title='Связаться с отделом продаж'
			>
				<ContactForm />
			</Modal>
		</>
	)
}
