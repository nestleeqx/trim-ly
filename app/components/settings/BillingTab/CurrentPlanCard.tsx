import Button from '../../ui/Button'
import styles from './BillingTab.module.scss'

export const CurrentPlanCard: React.FC = () => {
	return (
		<div className={styles.planCard}>
			<div>
				<div className={styles.planHeader}>
					<div>
						<div className={styles.planLabel}>ТЕКУЩИЙ ПЛАН</div>
						<h3 className={styles.planTitle}>Бесплатный план</h3>
					</div>
					<div className={styles.badge}>ACTIVE</div>
				</div>
				<p className={styles.planDesc}>
					Ваш бесплатный доступ постоянный. Обновитесь, чтобы открыть
					расширенные функции, такие как собственные домены и командная
					работа.
				</p>
			</div>

			<div className={styles.planAction}>
				<Button variant='primary'>Обновить до PRO</Button>
			</div>
		</div>
	)
}
