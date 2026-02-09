import { LinkItem as LinkItemType } from '@/types/links'
import { BarChart3, Copy, QrCode } from 'lucide-react'
import styles from './LinkCard.module.scss'

interface QuickButtonsProps {
	stop: (e: React.MouseEvent) => void
	link: LinkItemType
	actions: {
		handleCopy: (url: string, e: React.MouseEvent) => void
		handleQrClick: (link: LinkItemType, e: React.MouseEvent) => void
		handleAnalyticsClick: (id: string, e: React.MouseEvent) => void
	}
}

export const QuickButtons: React.FC<QuickButtonsProps> = ({
	stop,
	link,
	actions
}) => {
	return (
		<div className={styles.quickActions}>
			<button
				type='button'
				className={styles.quickActionBtn}
				title='Копировать'
				onClick={e => {
					stop(e)
					actions.handleCopy(link.shortUrl, e)
				}}
			>
				<Copy size={16} />
				<span>Копировать</span>
			</button>

			<button
				type='button'
				className={styles.quickActionBtn}
				title='QR код'
				onClick={e => {
					stop(e)
					actions.handleQrClick(link, e)
				}}
			>
				<QrCode size={16} />
				<span>QR</span>
			</button>

			<button
				type='button'
				className={styles.quickActionBtn}
				title='Аналитика'
				onClick={e => {
					stop(e)
					actions.handleAnalyticsClick(link.id, e)
				}}
			>
				<BarChart3 size={16} />
				<span>Статистика</span>
			</button>
		</div>
	)
}
