import PlanCard from '@/app/components/ui/PlanCard/PlanCard'
import { dashboardPlans } from './pricing.config'
import styles from './page.module.scss'

interface PlanCardsGridProps {
	isYearly: boolean
	onContactClick: () => void
}

export const PlanCardsGrid: React.FC<PlanCardsGridProps> = ({
	isYearly,
	onContactClick
}) => {
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
