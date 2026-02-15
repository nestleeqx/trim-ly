'use client'

import Modal from '@/app/components/ui/Modal/Modal'
import Toast from '@/app/components/ui/Toast/Toast'
import BillingToggle from '@/app/features/pricing/components/BillingToggle/BillingToggle'
import ContactForm from '@/app/features/pricing/components/ContactForm/ContactForm'
import PlanCard from '@/app/features/pricing/components/PlanCard/PlanCard'
import { plans } from '@/app/features/pricing/pricing.config'
import { getBilling, updateBillingPlan } from '@/app/features/profile/api/profileApi'
import { useToast } from '@/hooks/useToast'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './Pricing.module.scss'

type PlanId = 'free' | 'pro' | 'team'

export default function Pricing() {
	const { status } = useSession()
	const isAuthenticated = status === 'authenticated'

	const [isContactModalOpen, setContactModalOpen] = useState(false)
	const [isYearly, setIsYearly] = useState(false)
	const [currentPlanId, setCurrentPlanId] = useState<PlanId | null>(null)
	const [isUpdatingPlan, setIsUpdatingPlan] = useState(false)
	const { toast, showToast, hideToast } = useToast()

	const openContactModal = useCallback(() => setContactModalOpen(true), [])
	const closeContactModal = useCallback(() => setContactModalOpen(false), [])

	useEffect(() => {
		if (!isAuthenticated) {
			setCurrentPlanId(null)
			return
		}

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
	}, [isAuthenticated])

	const handleSelectPlan = useCallback(
		async (planId: PlanId) => {
			if (!isAuthenticated) return
			if (isUpdatingPlan) return
			if (currentPlanId === planId) return

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
		[currentPlanId, isAuthenticated, isUpdatingPlan, showToast]
	)

	const resolvedPlans = useMemo(() => {
		if (isAuthenticated) return plans

		return plans.map(plan => {
			if (plan.href === '/signup?plan=pro') {
				return {
					...plan,
					href: '/signup?plan=pro&callbackUrl=/pricing'
				}
			}
			return plan
		})
	}, [isAuthenticated])

	return (
		<>
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
						{resolvedPlans.map((plan, index) => (
							<motion.div
								key={plan.id}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
							>
								<PlanCard
									plan={plan}
									isYearly={isYearly}
									onContactClick={openContactModal}
									onSelectPlan={isAuthenticated ? handleSelectPlan : undefined}
									currentPlanId={isAuthenticated ? currentPlanId : null}
									isUpdating={isAuthenticated ? isUpdatingPlan : false}
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

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
				variant={toast.variant}
			/>
		</>
	)
}
