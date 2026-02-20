import Button from '@/app/components/ui/Button/Button'
import buttonStyles from '@/app/components/ui/Button/Button.module.scss'
import cn from 'classnames'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import styles from '../Sidebar.module.scss'

interface UpgradeBannerProps {
	planName?: string
	onUpgradeClick?: () => void
	isLimitReached?: boolean
}

function getButtonLabel(isLimitReached: boolean, isPaidPlan: boolean) {
	if (isLimitReached) return 'Обновить тариф'
	if (isPaidPlan) return 'Управление тарифом'
	return 'Перейти на Pro'
}

export default function UpgradeBanner({
	planName = 'Бесплатный план',
	onUpgradeClick,
	isLimitReached = false
}: UpgradeBannerProps) {
	const normalizedPlan = planName.trim().toLowerCase()
	const isPaidPlan =
		normalizedPlan.includes('pro') || normalizedPlan.includes('команда')
	const label = getButtonLabel(isLimitReached, isPaidPlan)

	return (
		<>
			{isLimitReached && (
				<div className={styles.upgradeHint}>
					<span>Вы достигли лимита. Нужен тариф выше.</span>
				</div>
			)}

			{onUpgradeClick ? (
				<Button
					variant='primary'
					size='lg'
					onClick={onUpgradeClick}
					className={styles.upgradeBtn}
				>
					<Zap className={styles.upgradeIcon} />
					<span>{label}</span>
				</Button>
			) : (
				<Link
					href='/pricing'
					className={cn(
						buttonStyles.button,
						buttonStyles.primary,
						buttonStyles.lg,
						styles.upgradeBtn
					)}
				>
					<Zap className={styles.upgradeIcon} />
					<span>{label}</span>
				</Link>
			)}

			<span className={styles.planText}>{planName}</span>
		</>
	)
}
