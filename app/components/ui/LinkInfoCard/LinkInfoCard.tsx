'use client'

import { LinkItem } from '@/types/links'
import { Copy } from 'lucide-react'
import { useCallback } from 'react'
import LinkActions from '../LinkActions/LinkActions'
import StatusBadge from '../StatusBadge/StatusBadge'
import styles from './LinkInfoCard.module.scss'

interface LinkInfoCardProps {
	link: LinkItem
	onEdit: () => void
	onPause: () => void
	onResume: () => void
	onDelete: () => void
	onDownloadQr: () => void
	onCopy: (url: string) => void
	hideEditButton?: boolean
}

const LinkInfoCard: React.FC<LinkInfoCardProps> = ({
	link,
	onEdit,
	onPause,
	onResume,
	onDelete,
	onDownloadQr,
	onCopy,
	hideEditButton = false
}) => {
	const handleCopyShortUrl = useCallback(() => {
		onCopy(link.shortUrl)
	}, [link.shortUrl, onCopy])

	return (
		<div className={styles.card}>
			<div className={styles.cardContent}>
				<div className={styles.linkInfo}>
					<div className={styles.titleRow}>
						<h2 className={styles.linkTitle}>{link.title}</h2>
						<StatusBadge status={link.status} />
					</div>

					<div className={styles.urls}>
						<div className={styles.shortUrl}>
							<span className={styles.shortUrlText}>
								{link.shortUrl}
							</span>
							<button
								className={styles.copyBtn}
								onClick={handleCopyShortUrl}
								aria-label='Копировать короткую ссылку'
							>
								<Copy size={14} />
							</button>
						</div>
						<span className={styles.destination}>
							{link.destination}
						</span>
					</div>
				</div>

				<LinkActions
					status={link.status}
					onEdit={onEdit}
					onPause={onPause}
					onResume={onResume}
					onDelete={onDelete}
					onDownloadQr={onDownloadQr}
					hideEditButton={hideEditButton}
				/>
			</div>
		</div>
	)
}

export default LinkInfoCard
