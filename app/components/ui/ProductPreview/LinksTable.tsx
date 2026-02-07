import { BarChart3, Copy, ExternalLink } from 'lucide-react'
import styles from './ProductPreview.module.scss'
import { PreviewLink } from './preview.config'

interface LinksTableProps {
	links: PreviewLink[]
	onCopy: (slug: string) => void
	onAnalyticsClick: () => void
}

export const LinksTable: React.FC<LinksTableProps> = ({
	links,
	onCopy,
	onAnalyticsClick
}) => {
	return (
		<div className={styles.linksTable}>
			<div className={styles.tableHeader}>
				<span>НАЗВАНИЕ / URL</span>
				<span>КЛИКИ</span>
				<span>СТАТУС</span>
				<span>ДЕЙСТВИЯ</span>
			</div>

			{links.map((link, index) => (
				<div
					key={index}
					className={styles.linkRow}
				>
					<div className={styles.linkInfo}>
						<p className={styles.linkTitle}>{link.title}</p>
						<p className={styles.linkSlug}>{link.slug}</p>
					</div>
					<div className={styles.linkClicks}>
						{link.clicks.toLocaleString()}
					</div>
					<div className={styles.linkStatus}>
						<span className={styles.statusBadge}>
							{link.status === 'active' ? 'АКТИВНА' : ''}
						</span>
					</div>
					<div className={styles.linkActions}>
						<button
							aria-label='Копировать'
							onClick={() => onCopy(link.slug)}
							title='Копировать'
						>
							<Copy size={16} />
						</button>
						<button
							aria-label='Открыть'
							onClick={onAnalyticsClick}
						>
							<ExternalLink size={16} />
						</button>
						<button
							aria-label='Статистика'
							onClick={onAnalyticsClick}
							title='Аналитика'
						>
							<BarChart3 size={16} />
						</button>
					</div>
				</div>
			))}
		</div>
	)
}
