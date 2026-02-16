import Button from '@/app/components/ui/Button/Button'
import Link from 'next/link'
import { PlanLike } from './types'

interface PlanCardActionProps {
	plan: PlanLike
	isCurrent: boolean
	isUpdating: boolean
	onContactClick: () => void
	onSelectPlan?: (planId: PlanLike['id']) => void
}

export default function PlanCardAction({
	plan,
	isCurrent,
	isUpdating,
	onContactClick,
	onSelectPlan
}: PlanCardActionProps) {
	if (plan.isContact) {
		return (
			<Button
				variant={plan.buttonVariant}
				size='lg'
				onClick={onContactClick}
			>
				{plan.buttonText}
			</Button>
		)
	}

	if (onSelectPlan) {
		return (
			<Button
				variant={plan.buttonVariant}
				size='lg'
				onClick={() => onSelectPlan(plan.id)}
				disabled={isCurrent || isUpdating}
			>
				{isCurrent ? 'Текущий план' : plan.buttonText}
			</Button>
		)
	}

	return (
		<Link href={plan.href || '#'}>
			<Button
				variant={plan.buttonVariant}
				size='lg'
			>
				{plan.buttonText}
			</Button>
		</Link>
	)
}
