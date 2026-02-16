import cn from 'classnames'
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
					className={cn(styles.toggleOption, {
						[styles.active]: !isYearly
					})}
					onClick={() => onToggle(false)}
				>
					Ежемесячно
				</button>
				<button
					className={cn(styles.toggleOption, {
						[styles.active]: isYearly
					})}
					onClick={() => onToggle(true)}
				>
					Ежегодно
				</button>
				<div
					className={cn(styles.toggleSlider, {
						[styles.right]: isYearly,
						[styles.left]: !isYearly
					})}
				/>
			</div>
			{isYearly && (
				<span className={styles.saveBadge}>Скидка до 20%</span>
			)}
		</div>
	)
}
