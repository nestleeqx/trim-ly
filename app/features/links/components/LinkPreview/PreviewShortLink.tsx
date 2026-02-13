'use client'

import StatusBadge from '@/app/components/ui/StatusBadge/StatusBadge'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { LinkStatus } from '@/types/links'
import { Copy } from 'lucide-react'
import styles from './LinkPreview.module.scss'

const STATUS_LABELS: Record<LinkStatus, string> = {
	active: 'АКТИВНА',
	paused: 'ПАУЗА',
	expired: 'ИСТЕКЛА',
	deleted: 'УДАЛЕНА'
}

interface PreviewShortLinkProps {
	shortUrl: string
	status: LinkStatus
	onCopy: () => void
}

export default function PreviewShortLink({
	shortUrl,
	status,
	onCopy
}: PreviewShortLinkProps) {
	const { copied, copy } = useCopyToClipboard({ onCopy })

	return (
		<div className={styles.previewSection}>
			<StatusBadge
				status={status}
				className={styles.previewBadge}
			/>
			<span className={styles.previewLabel}>КОРОТКАЯ ССЫЛКА</span>
			<div className={styles.shortLinkDisplay}>
				<span className={styles.shortLinkText}>{shortUrl}</span>
				<button
					type='button'
					onClick={copy}
					className={styles.copyBtn}
					title='Копировать'
				>
					<Copy size={16} />
				</button>
			</div>
			{copied && <span className={styles.copiedText}>Скопировано!</span>}
		</div>
	)
}
