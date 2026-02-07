'use client'

import Toast from '@/app/components/ui/Toast/Toast'
import { mockLinks } from '@/data/mockLinks'
import { useLinkActions } from '@/hooks/useLinkActions'
import { LinkItem } from '@/types/links'
import { Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import QrCodeModal from '../QrCodeModal'
import styles from './RecentLinks.module.scss'
import { RecentLinksSkeleton } from './RecentLinksSkeleton'
import { RecentLinksTableRow } from './RecentLinksTableRow'

interface RecentLinksProps {
	links?: LinkItem[]
	isLoading?: boolean
	isEmpty?: boolean
	limit?: number
}

const RECENT_LINKS_LIMIT = 5

const RecentLinks: React.FC<RecentLinksProps> = ({
	links: externalLinks,
	isLoading = false,
	isEmpty = false,
	limit = RECENT_LINKS_LIMIT
}) => {
	const [toast, setToast] = useState({ message: '', isVisible: false })

	const showToast = useCallback((message: string) => {
		setToast({ message, isVisible: true })
	}, [])

	const hideToast = useCallback(() => {
		setToast(prev => ({ ...prev, isVisible: false }))
	}, [])

	const handleCopy = useCallback(() => {
		showToast('Скопировано!')
	}, [showToast])

	const handleDelete = useCallback(() => {
		showToast('Ссылка удалена')
	}, [showToast])

	const handlePause = useCallback(() => {
		showToast('Ссылка приостановлена')
	}, [showToast])

	const handleResume = useCallback(() => {
		showToast('Ссылка возобновлена')
	}, [showToast])

	const actions = useLinkActions({
		onCopy: handleCopy,
		onDelete: handleDelete,
		onPause: handlePause,
		onResume: handleResume
	})

	// Используем переданные ссылки или берём из mock данных
	const links = (externalLinks ?? mockLinks).slice(0, limit)

	if (isEmpty || (!isLoading && links.length === 0)) {
		return (
			<div className={styles.card}>
				<div className={styles.header}>
					<h3 className={styles.title}>Последние ссылки</h3>
				</div>
				<div className={styles.emptyState}>
					<LinkIcon
						size={48}
						className={styles.emptyIcon}
					/>
					<h4 className={styles.emptyTitle}>Нет ссылок</h4>
					<p className={styles.emptyText}>
						Создайте свою первую короткую ссылку
					</p>
					<Link
						href='/links/new'
						className={styles.emptyBtn}
					>
						<Plus size={18} />
						<span>Создать ссылку</span>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h3 className={styles.title}>Последние ссылки</h3>
				<Link
					href='/links'
					className={styles.viewAll}
				>
					Смотреть все
				</Link>
			</div>

			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>НАЗВАНИЕ</th>
							<th>КОРОТКИЙ URL</th>
							<th>КЛИКИ</th>
							<th>СТАТУС</th>
							<th>СОЗДАНО</th>
							<th>ДЕЙСТВИЯ</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<RecentLinksSkeleton count={limit} />
						) : (
							links.map(link => (
								<RecentLinksTableRow
									key={link.id}
									link={link}
									openKebabId={actions.openKebabId}
									actions={actions}
								/>
							))
						)}
					</tbody>
				</table>
			</div>

			{actions.qrModalLink && (
				<QrCodeModal
					link={actions.qrModalLink}
					onClose={actions.closeQrModal}
					onCopyUrl={actions.handleCopyQrUrl}
					onDownload={actions.handleDownloadQr}
				/>
			)}

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
			/>
		</div>
	)
}

export default RecentLinks
