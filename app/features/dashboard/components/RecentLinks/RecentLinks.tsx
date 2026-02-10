'use client'

import Toast from '@/app/components/ui/Toast/Toast'
import { mockLinks } from '@/data/mockLinks'
import { useActionCallbacks } from '@/hooks/useActionCallbacks'
import { useToast } from '@/hooks/useToast'
import { LinkItem } from '@/types/links'
import { Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import LinksTable from '../../../links/components/LinksTable/LinksTable'
import styles from './RecentLinks.module.scss'
import RecentLinksSkeleton from './RecentLinksSkeleton'

interface RecentLinksProps {
	links?: LinkItem[]
	isLoading?: boolean
	isEmpty?: boolean
	limit?: number
}

const RECENT_LINKS_LIMIT = 5

export default function RecentLinks({
	links: externalLinks,
	isLoading = false,
	isEmpty = false,
	limit = RECENT_LINKS_LIMIT
}: RecentLinksProps) {
	const { toast, showToast, hideToast } = useToast()
	const { handleCopy, handleDelete, handlePause, handleResume } =
		useActionCallbacks({ showToast })

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
			{isLoading ? (
				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<tbody>
							<RecentLinksSkeleton count={limit} />
						</tbody>
					</table>
				</div>
			) : (
				<LinksTable
					links={links}
					selectedLinks={[]}
					onSelectAll={() => {}}
					onSelectLink={() => {}}
					onCopy={handleCopy}
					onDelete={handleDelete}
					onPause={handlePause}
					onResume={handleResume}
					allowSelection={false}
					showTrend={false}
					showActions={true}
					title='Последние ссылки'
					allLinksHref='/links'
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
