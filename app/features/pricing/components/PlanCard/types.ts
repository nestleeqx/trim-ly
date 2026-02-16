export type PlanCardButtonVariant =
	| 'primary'
	| 'invertPrimary'
	| 'secondary'
	| 'ghost'
	| 'invertGhost'
	| 'outline'
	| 'invertOutline'

export interface PlanLike {
	id: 'free' | 'pro' | 'team'
	name: string
	monthlyPrice: string | number
	yearlyPrice: string | number
	description?: string
	features: { text: string }[]
	buttonText: string
	buttonVariant?: PlanCardButtonVariant
	popular?: boolean
	href?: string
	isContact?: boolean
	discount?: string
}

export interface PlanCardProps {
	plan: PlanLike
	isYearly: boolean
	onContactClick: () => void
	onSelectPlan?: (planId: PlanLike['id']) => void
	currentPlanId?: PlanLike['id'] | null
	isUpdating?: boolean
}
