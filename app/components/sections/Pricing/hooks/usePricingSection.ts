'use client'

import { plans } from '@/app/features/pricing/pricing.config'
import { getBilling, updateBillingPlan } from '@/app/features/profile/api/profileApi'
import { useToast } from '@/hooks/useToast'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

type PlanId = 'free' | 'pro' | 'team'

export default function usePricingSection() {
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
			if (!isAuthenticated || isUpdatingPlan || currentPlanId === planId) return

			setIsUpdatingPlan(true)
			try {
				const response = await updateBillingPlan(planId)
				setCurrentPlanId(response.plan.id as PlanId)
				showToast('Тариф обновлён', 'success')
				window.dispatchEvent(new Event('billing-updated'))
			} catch (error) {
				showToast(
					error instanceof Error ? error.message : 'Не удалось сменить тариф',
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

		return plans.map(plan =>
			plan.href === '/signup?plan=pro'
				? { ...plan, href: '/signup?plan=pro&callbackUrl=/pricing' }
				: plan
		)
	}, [isAuthenticated])

	return {
		isAuthenticated,
		isContactModalOpen,
		isYearly,
		currentPlanId,
		isUpdatingPlan,
		toast,
		openContactModal,
		closeContactModal,
		setIsYearly,
		handleSelectPlan,
		resolvedPlans,
		hideToast
	}
}

