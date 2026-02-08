'use client'

import LinksCards from '@/app/components/dashboard/LinksCards/LinksCards'
import Pagination from '@/app/components/dashboard/Pagination/Pagination'
import LinksTable from '@/app/components/ui/LinksTable/LinksTable'
import { LinkItem } from '@/types/links'
import styles from './LinksViewContent.module.scss'

interface LinksViewContentProps {
	viewMode: 'list' | 'grid'
	links: LinkItem[]
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
	onPageChange: (page: number) => void
	onItemsPerPageChange: (count: number) => void
}

export default function LinksViewContent({
	viewMode,
	links,
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
	onPageChange,
	onItemsPerPageChange
}: LinksViewContentProps) {
	return (
		<div className={styles.container}>
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
				/>
			)}

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
