import cn from 'classnames'
import { Check } from 'lucide-react'
import PlanCardAction from './PlanCardAction'
import styles from './PlanCard.module.scss'
import { PlanCardProps } from './types'

export default function PlanCard({
	plan,
	isYearly,
	onContactClick,
	onSelectPlan,
	currentPlanId = null,
	isUpdating = false
}: PlanCardProps) {
	const isCurrent = currentPlanId === plan.id
	const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
	const period = isYearly ? '/год' : '/месяц'

	return (
		<div
			className={cn(styles.card, {
				[styles.popular]: plan.popular
			})}
		>
			{plan.popular ? <span className={styles.badge}>ПОПУЛЯРНЫЙ</span> : null}

			<div className={styles.cardHeader}>
				<h3 className={styles.planName}>{plan.name}</h3>
				<div className={styles.priceWrapper}>
					<span className={styles.price}>{price}</span>
					<span className={styles.currency}>₽</span>
					<span className={styles.period}>{period}</span>
				</div>
				{isYearly && plan.discount ? (
					<span className={styles.discount}>{plan.discount}</span>
				) : null}
				{plan.description ? (
					<p className={styles.planDescription}>{plan.description}</p>
				) : null}
			</div>

			<ul className={styles.features}>
				{plan.features.map((feature, idx) => (
					<li
						key={idx}
						className={styles.feature}
					>
						<Check
							size={18}
							className={styles.checkIcon}
						/>
						<span>{feature.text}</span>
					</li>
				))}
			</ul>

			<div className={styles.cardFooter}>
				<div className={styles.buttonLink}>
					<PlanCardAction
						plan={plan}
						isCurrent={isCurrent}
						isUpdating={isUpdating}
						onContactClick={onContactClick}
						onSelectPlan={onSelectPlan}
					/>
				</div>
			</div>
		</div>
	)
}
