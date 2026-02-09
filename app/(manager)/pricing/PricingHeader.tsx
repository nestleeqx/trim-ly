import BillingToggle from '@/app/components/ui/BillingToggle/BillingToggle'
import styles from './page.module.scss'

interface PricingHeaderProps {
	isYearly: boolean
	onToggle: (isYearly: boolean) => void
}

export const PricingHeader: React.FC<PricingHeaderProps> = ({
	isYearly,
	onToggle
}) => {
	return (
		<div className={styles.header}>
			<h2 className={styles.title}>
				Простые тарифы для каждого этапа
			</h2>
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
