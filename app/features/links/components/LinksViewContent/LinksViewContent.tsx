'use client'

import Pagination from '@/app/components/ui/Pagination/Pagination'
import LinksTable from '@/app/features/links/components/LinksTable/LinksTable'
import { LinkItem } from '@/types/links'
import LinksCards from './LinksCards/LinksCards'
import styles from './LinksViewContent.module.scss'

interface LinksViewContentProps {
	viewMode: 'list' | 'grid'
	links: LinkItem[]
	isRefetching?: boolean
	selectedLinks: string[]
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	onSelectAll: (checked: boolean) => void
	onSelectLink: (id: string, checked: boolean) => void
	onCopy: (shortUrl: string) => void
	onDelete: (id: string) => void
	onPause: (id: string) => void
	onResume: (id: string) => void
	onRestore: (id: string) => void
	onPageChange: (page: number) => void
	onItemsPerPageChange: (count: number) => void
}

export default function LinksViewContent({
	viewMode,
	links,
	isRefetching = false,
	selectedLinks,
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onSelectAll,
	onSelectLink,
	onCopy,
	onDelete,
	onPause,
	onResume,
	onRestore,
	onPageChange,
	onItemsPerPageChange
}: LinksViewContentProps) {
	return (
		<div className={styles.container}>
			<div className={styles.contentArea}>
				{viewMode === 'list' ? (
					<LinksTable
						links={links}
						selectedLinks={selectedLinks}
						onSelectAll={onSelectAll}
						onSelectLink={onSelectLink}
						onCopy={onCopy}
						onDelete={onDelete}
						onPause={onPause}
						onResume={onResume}
						onRestore={onRestore}
					/>
				) : (
					<LinksCards
						links={links}
						selectedLinks={selectedLinks}
						onSelectLink={onSelectLink}
						onCopy={onCopy}
						onDelete={onDelete}
						onPause={onPause}
						onResume={onResume}
						onRestore={onRestore}
					/>
				)}

				{isRefetching && (
					<div
						className={styles.loadingOverlay}
						aria-hidden='true'
					>
						<div className={styles.linearLoader} />
						<div className={styles.spinner} />
					</div>
				)}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={totalItems}
				itemsPerPage={itemsPerPage}
				onPageChange={onPageChange}
				onItemsPerPageChange={onItemsPerPageChange}
			/>
		</div>
	)
}
