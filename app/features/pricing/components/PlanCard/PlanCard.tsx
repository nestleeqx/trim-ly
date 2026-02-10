import Button from '@/app/components/ui/Button/Button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import styles from './PlanCard.module.scss'

export interface PlanLike {
	name: string
	monthlyPrice: string | number
	yearlyPrice: string | number
	description?: string
	features: { text: string }[]
	buttonText: string
	buttonVariant?: 'primary' | 'outline' | 'ghost' | string
	popular?: boolean
	href?: string
	isContact?: boolean
	discount?: string
}

interface PlanCardProps {
	plan: PlanLike
	isYearly: boolean
	onContactClick: () => void
}

export default function PlanCard({
	plan,
	isYearly,
	onContactClick
}: PlanCardProps) {
	const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
	const period = isYearly ? '/год' : '/месяц'

	return (
		<div className={`${styles.card} ${plan.popular ? styles.popular : ''}`}>
			{plan.popular && <span className={styles.badge}>ПОПУЛЯРНЫЙ</span>}

			<div className={styles.cardHeader}>
				<h3 className={styles.planName}>{plan.name}</h3>
				<div className={styles.priceWrapper}>
					<span className={styles.price}>{price}</span>
					<span className={styles.currency}>₽</span>
					<span className={styles.period}>{period}</span>
				</div>
				{isYearly && plan.discount && (
					<span className={styles.discount}>{plan.discount}</span>
				)}
				{plan.description && (
					<p className={styles.planDescription}>{plan.description}</p>
				)}
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
				{plan.isContact ? (
					<div className={styles.buttonLink}>
						<Button
							variant={plan.buttonVariant}
							size='lg'
							onClick={onContactClick}
						>
							{plan.buttonText}
						</Button>
					</div>
				) : (
					<Link
						href={plan.href || '#'}
						className={styles.buttonLink}
					>
						<Button
							variant={plan.buttonVariant}
							size='lg'
						>
							{plan.buttonText}
						</Button>
					</Link>
				)}
			</div>
		</div>
	)
}
