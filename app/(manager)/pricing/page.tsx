'use client'

import styles from '@/app/(manager)/pricing/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Modal from '@/app/components/ui/Modal/Modal'
import ComparisonTable from '@/app/features/pricing/components/ComparisonTable/ComparisonTable'
import ContactForm from '@/app/features/pricing/components/ContactForm/ContactForm'
import FAQSection from '@/app/features/pricing/components/FAQSection/FAQSection'
import PlanCardsGrid from '@/app/features/pricing/components/PlanCardsGrid/PlanCardsGrid'
import PricingHeader from '@/app/features/pricing/components/PricingHeader/PricingHeader'
import TestimonialsGrid from '@/app/features/pricing/components/TestimonialsGrid/TestimonialsGrid'
import { useCallback, useState } from 'react'

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
