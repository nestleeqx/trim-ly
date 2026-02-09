import { Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from '../../ui/Button'
import styles from './Sidebar.module.scss'

interface UpgradeBannerProps {
	planName?: string
	onUpgradeClick?: () => void
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({
	planName = 'Бесплатный план',
	onUpgradeClick
}) => {
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
