import { LinkItem as LinkItemType } from '@/types/links'
import { formatDate } from '@/utils/formatters'
import styles from './LinkCard.module.scss'

interface LinkCardStatsProps {
	link: LinkItemType
}

export default function LinkCardStats({ link }: LinkCardStatsProps) {
	return (
		<div className={styles.stats}>
			<div className={styles.statItem}>
				<span className={styles.statLabel}>Клики</span>
				<span className={styles.statValue}>
					{link.clicks.toLocaleString()}
				</span>
			</div>
			<div className={styles.statItem}>
				<span className={styles.statLabel}>Создано</span>
				<span className={styles.statValue}>{formatDate(link.createdAt)}</span>
			</div>
		</div>
	)
}
