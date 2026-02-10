import styles from './BillingToggle.module.scss'

interface BillingToggleProps {
	isYearly: boolean
	onToggle: (isYearly: boolean) => void
}

export default function BillingToggle({
	isYearly,
	onToggle
}: BillingToggleProps) {
	return (
		<div className={styles.toggleContainer}>
			<div className={styles.toggleWrapper}>
				<button
					className={`${styles.toggleOption} ${!isYearly ? styles.active : ''}`}
					onClick={() => onToggle(false)}
				>
					Ежемесячно
				</button>
				<button
					className={`${styles.toggleOption} ${isYearly ? styles.active : ''}`}
					onClick={() => onToggle(true)}
				>
					Ежегодно
				</button>
				<div
					className={`${styles.toggleSlider} ${isYearly ? styles.right : styles.left}`}
				/>
			</div>
			{isYearly && (
				<span className={styles.saveBadge}>Скидка до 20%</span>
			)}
		</div>
	)
}
