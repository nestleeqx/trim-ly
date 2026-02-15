import Button from '@/app/components/ui/Button/Button'
import { Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './Sidebar.module.scss'

interface UpgradeBannerProps {
	planName?: string
	onUpgradeClick?: () => void
	isLimitReached?: boolean
}

export default function UpgradeBanner({
	planName = 'Бесплатный план',
	onUpgradeClick,
	isLimitReached = false
}: UpgradeBannerProps) {
	const router = useRouter()
	const normalizedPlan = planName.trim().toLowerCase()
	const isPaidPlan =
		normalizedPlan.includes('pro') || normalizedPlan.includes('команда')

	const handleClick = () => {
		if (onUpgradeClick) return onUpgradeClick()
		router.push('/pricing')
	}

	return (
		<>
			{isLimitReached && (
				<div className={styles.upgradeHint}>
					<span>Вы достигли лимита. Нужен тариф выше.</span>
				</div>
			)}
			<Button
				variant='primary'
				size='lg'
				onClick={handleClick}
				className={styles.upgradeBtn}
			>
				<Zap className={styles.upgradeIcon} />
				<span>
					{isLimitReached
						? 'Обновить тариф'
						: isPaidPlan
							? 'Управление тарифом'
							: 'Перейти на Pro'}
				</span>
			</Button>
			<span className={styles.planText}>{planName}</span>
		</>
	)
}
