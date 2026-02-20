'use client'

import styles from '@/app/(manager)/pricing/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Modal from '@/app/components/ui/Modal/Modal'
import Toast from '@/app/components/ui/Toast/Toast'
import ComparisonTable from '@/app/features/pricing/components/ComparisonTable/ComparisonTable'
import ContactForm from '@/app/features/pricing/components/ContactForm/ContactForm'
import FAQSection from '@/app/features/pricing/components/FAQSection/FAQSection'
import PlanCardsGrid from '@/app/features/pricing/components/PlanCardsGrid/PlanCardsGrid'
import PricingHeader from '@/app/features/pricing/components/PricingHeader/PricingHeader'
import TestimonialsGrid from '@/app/features/pricing/components/TestimonialsGrid/TestimonialsGrid'
import {
	getBilling,
	updateBillingPlan
} from '@/app/features/profile/api/profileApi'
import { useToast } from '@/hooks/useToast'
import { useCallback, useEffect, useState } from 'react'

type PlanId = 'free' | 'pro' | 'team'

export default function PricingPage() {
	const [isYearly, setIsYearly] = useState(false)
	const [isContactModalOpen, setContactModalOpen] = useState(false)
	const [currentPlanId, setCurrentPlanId] = useState<PlanId | null>(null)
	const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)
	const { toast, showToast, hideToast } = useToast()

	const openContactModal = useCallback(() => setContactModalOpen(true), [])
	const closeContactModal = useCallback(() => setContactModalOpen(false), [])

	useEffect(() => {
		let active = true

		const loadBilling = async () => {
			try {
				const billing = await getBilling()
				if (!active) return
				setCurrentPlanId(billing.plan.id as PlanId)
			} catch {
				if (!active) return
				setCurrentPlanId(null)
			}
		}

		void loadBilling()
		return () => {
			active = false
		}
	}, [])

	const handleSelectPlan = useCallback(
		async (planId: PlanId) => {
			if (isUpdatingPlan || currentPlanId === planId) return

			setIsUpdatingPlan(true)
			try {
				const response = await updateBillingPlan(planId)
				setCurrentPlanId(response.plan.id as PlanId)
				showToast('Тариф обновлён', 'success')
				window.dispatchEvent(new Event('billing-updated'))
			} catch (error) {
				showToast(
					error instanceof Error
						? error.message
						: 'Не удалось сменить тариф',
					'error'
				)
			} finally {
				setIsUpdatingPlan(false)
			}
		},
		[currentPlanId, isUpdatingPlan, showToast]
	)

	return (
		<>
			<DashboardHeader
				title='Тарифы'
				subtitle='Обзор вашего аккаунта.'
				showCreateButton
			/>
			<div className={styles.content}>
				<PricingHeader
					isYearly={isYearly}
					onToggle={setIsYearly}
				/>
				<PlanCardsGrid
					isYearly={isYearly}
					onContactClick={openContactModal}
					onSelectPlan={handleSelectPlan}
					currentPlanId={currentPlanId}
					isUpdatingPlan={isUpdatingPlan}
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
			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
				variant={toast.variant}
			/>
		</>
	)
}
