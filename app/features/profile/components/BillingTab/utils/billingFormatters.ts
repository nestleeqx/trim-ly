import type { BillingPlanStatus } from '@/app/features/profile/api/profileApi'

export function normalizePlanName(planId: string, planName: string) {
	const id = planId.toLowerCase()
	const name = planName.toLowerCase()

	if (id === 'free' || name.includes('free')) return 'Бесплатный'
	if (id === 'pro' || name.includes('pro')) return 'Pro'
	if (id === 'team' || name.includes('team') || name.includes('команд'))
		return 'Команда'

	return planName
}

export function normalizeSubscriptionStatus(status: BillingPlanStatus) {
	switch (status) {
		case 'active':
			return 'Активен'
		case 'canceled':
			return 'Отменён'
		case 'past_due':
			return 'Просрочен'
		default:
			return status
	}
}

export function formatCount(value: number): string {
	return new Intl.NumberFormat('ru-RU').format(value)
}
