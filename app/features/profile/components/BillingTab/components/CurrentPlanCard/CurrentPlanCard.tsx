import Button from '@/app/components/ui/Button/Button'
import Link from 'next/link'
import styles from '../../BillingTab.module.scss'

interface CurrentPlanCardProps {
	planName: string
	status: string
}

export default function CurrentPlanCard({
	planName,
	status
}: CurrentPlanCardProps) {
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
					Здесь вы видите текущий тариф, лимиты и историю платежей.
					Для портфолио-проекта блок обновления можно оставить в
					демо-режиме.
				</p>
			</div>

			<div className={styles.planAction}>
				<Link href='/pricing'>
					<Button variant='primary'>Обновить до PRO</Button>
				</Link>
			</div>
		</div>
	)
}
