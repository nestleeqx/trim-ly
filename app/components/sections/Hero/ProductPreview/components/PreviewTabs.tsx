import cn from 'classnames'
import styles from '../ProductPreview.module.scss'

interface PreviewTabsProps {
	onAnalyticsClick: () => void
}

export default function PreviewTabs({ onAnalyticsClick }: PreviewTabsProps) {
	return (
		<div className={styles.tabs}>
			<button className={cn(styles.tab, styles.active)}>Ссылки</button>
			<button
				className={styles.tab}
				onClick={() => onAnalyticsClick()}
			>
				Аналитика
			</button>
		</div>
	)
}
