import BillingToggle from '@/app/features/pricing/components/BillingToggle/BillingToggle'
import styles from './PricingHeader.module.scss'

interface PricingHeaderProps {
	isYearly: boolean
	onToggle: (isYearly: boolean) => void
}

export default function PricingHeader({
	isYearly,
	onToggle
}: PricingHeaderProps) {
	return (
		<div className={styles.header}>
			<h2 className={styles.title}>Простые тарифы для каждого этапа</h2>
			<p className={styles.subtitle}>
				Начните бесплатно. Масштабируйтесь по мере роста. Управляйте
				ссылками с помощью профессиональных инструментов и аналитики.
			</p>

			<BillingToggle
				isYearly={isYearly}
				onToggle={onToggle}
			/>
		</div>
	)
}
