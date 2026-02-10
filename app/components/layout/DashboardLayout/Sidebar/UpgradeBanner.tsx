import Button from '@/app/components/ui/Button/Button'
import { Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './Sidebar.module.scss'

interface UpgradeBannerProps {
	planName?: string
	onUpgradeClick?: () => void
}

export default function UpgradeBanner({
	planName = 'Бесплатный план',
	onUpgradeClick
}: UpgradeBannerProps) {
	const router = useRouter()

	const handleClick = () => {
		if (onUpgradeClick) return onUpgradeClick()
		router.push('/pricing')
	}

	return (
		<>
			<Button
				variant='primary'
				size='lg'
				onClick={handleClick}
				className={styles.upgradeBtn}
			>
				<Zap className={styles.upgradeIcon} />
				<span>Перейти на Pro</span>
			</Button>
			<span className={styles.planText}>{planName}</span>
		</>
	)
}
