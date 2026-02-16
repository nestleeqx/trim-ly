'use client'

import PlanCard from '@/app/features/pricing/components/PlanCard/PlanCard'
import { plans } from '@/app/features/pricing/pricing.config'
import { motion } from 'framer-motion'
import styles from '../Pricing.module.scss'

type PlanId = 'free' | 'pro' | 'team'

interface PricingPlansGridProps {
	plansData: typeof plans
	isYearly: boolean
	isAuthenticated: boolean
	currentPlanId: PlanId | null
	isUpdatingPlan: boolean
	onContactClick: () => void
	onSelectPlan: (planId: PlanId) => Promise<void>
}

export default function PricingPlansGrid({
	plansData,
	isYearly,
	isAuthenticated,
	currentPlanId,
	isUpdatingPlan,
	onContactClick,
	onSelectPlan
}: PricingPlansGridProps) {
	return (
		<div className={styles.grid}>
			{plansData.map((plan, index) => (
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
						onContactClick={onContactClick}
						onSelectPlan={isAuthenticated ? onSelectPlan : undefined}
						currentPlanId={isAuthenticated ? currentPlanId : null}
						isUpdating={isAuthenticated ? isUpdatingPlan : false}
					/>
				</motion.div>
			))}
		</div>
	)
}

