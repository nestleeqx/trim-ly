import PlanCard from '@/app/features/pricing/components/PlanCard/PlanCard'
import { dashboardPlans } from '../../pricing.config'
import styles from './PlanCardsGrid.module.scss'

interface PlanCardsGridProps {
	isYearly: boolean
	onContactClick: () => void
	onSelectPlan?: (planId: 'free' | 'pro' | 'team') => void
	currentPlanId?: 'free' | 'pro' | 'team' | null
	isUpdatingPlan?: boolean
}

export default function PlanCardsGrid({
	isYearly,
	onContactClick,
	onSelectPlan,
	currentPlanId,
	isUpdatingPlan = false
}: PlanCardsGridProps) {
	return (
		<div className={styles.grid}>
			{dashboardPlans.map(plan => (
				<PlanCard
					key={plan.id}
					plan={plan}
					isYearly={isYearly}
					onContactClick={onContactClick}
					onSelectPlan={onSelectPlan}
					currentPlanId={currentPlanId}
					isUpdating={isUpdatingPlan}
				/>
			))}
		</div>
	)
}
