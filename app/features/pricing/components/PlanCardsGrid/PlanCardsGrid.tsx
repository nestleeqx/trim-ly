import PlanCard from '@/app/features/pricing/components/PlanCard/PlanCard'
import { dashboardPlans } from '../../pricing.config'
import styles from './PlanCardsGrid.module.scss'

interface PlanCardsGridProps {
	isYearly: boolean
	onContactClick: () => void
}

export default function PlanCardsGrid({
	isYearly,
	onContactClick
}: PlanCardsGridProps) {
	return (
		<div className={styles.grid}>
			{dashboardPlans.map(plan => (
				<PlanCard
					key={plan.name}
					plan={plan}
					isYearly={isYearly}
					onContactClick={onContactClick}
				/>
			))}
		</div>
	)
}
