'use client'

import Button from '@/app/components/ui/Button/Button'
import { useRouter } from 'next/navigation'
import styles from '../../BillingTab.module.scss'

interface CurrentPlanCardProps {
	planId: string
	planName: string
	status: string
}

export default function CurrentPlanCard({
	planId,
	planName,
	status
}: CurrentPlanCardProps) {
	const router = useRouter()
	const normalizedPlanId = planId.trim().toLowerCase()

	const actionLabel =
		normalizedPlanId === 'free'
			? 'Обновить до PRO'
			: normalizedPlanId === 'pro'
				? 'Посмотреть тарифы'
				: 'Связаться с нами'

	const handleActionClick = () => {
		if (normalizedPlanId === 'team') {
			router.push('/pricing#contact')
			return
		}
		router.push('/pricing')
	}

	return (
		<div className={styles.planCard}>
			<div>
				<div className={styles.planHeader}>
					<div>
						<div className={styles.planLabel}>ТЕКУЩИЙ ПЛАН</div>
						<h3 className={styles.planTitle}>{planName}</h3>
					</div>
					<div className={styles.badge}>{status}</div>
				</div>
				<p className={styles.planDesc}>
					Здесь вы видите текущий тариф, лимиты и историю платежей. Для
					портфолио-проекта блок обновления можно оставить в демо-режиме.
				</p>
			</div>

			<div className={styles.planAction}>
				<Button
					variant='primary'
					onClick={handleActionClick}
				>
					{actionLabel}
				</Button>
			</div>
		</div>
	)
}
