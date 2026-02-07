'use client'

import { useLinkActions } from '@/hooks/useLinkActions'
import { LinkItem as LinkItemType } from '@/types/links'
import React from 'react'
import sharedStyles from '../LinksPage/shared.module.scss'
import QrCodeModal from '../QrCodeModal'
import { LinkTableRow } from './LinkTableRow'
import styles from './LinksTable.module.scss'

interface LinksTableProps {
	links: LinkItemType[]
	selectedLinks: string[]
	onSelectAll: (checked: boolean) => void
	onSelectLink: (id: string, checked: boolean) => void
	onCopy?: (shortUrl: string) => void
	onDelete?: (id: string) => void
	onPause?: (id: string) => void
	onResume?: (id: string) => void

	/** Optional title displayed above the table */
	title?: string

	/** Optional href to the page with all links; renders "Все ссылки" link to the left of the title */
	allLinksHref?: string

	/** When false, hide the selection checkbox column */
	allowSelection?: boolean

	/** When false, hide the actions column and kebab menu */
	showActions?: boolean
}

const LinksTable: React.FC<LinksTableProps> = ({
	links,
	selectedLinks,
	onSelectAll,
	onSelectLink,
	onCopy,
	onDelete,
	onPause,
	onResume,
	title,
	allLinksHref,
	allowSelection = true,
	showActions = true
}) => {
	const allSelected =
		links.length > 0 && selectedLinks.length === links.length

	const actions = useLinkActions({ onCopy, onDelete, onPause, onResume })

	return (
		<div className={styles.tableWrapper}>
			{(title || allLinksHref) && (
				<div className={styles.tableHeader}>
					{title && <div className={styles.tableTitle}>{title}</div>}
					{allLinksHref ? (
						<a
							href={allLinksHref}
							className={styles.allLinks}
						>
							Все ссылки
						</a>
					) : (
						<div />
					)}
					<div />
				</div>
			)}
			<table className={styles.table}>
				<thead>
					<tr>
						{allowSelection && (
							<th className={styles.checkboxCell}>
								<input
									type='checkbox'
									checked={allSelected}
									onChange={e =>
										onSelectAll(e.target.checked)
									}
									className={sharedStyles.checkbox}
									aria-label='Выбрать все ссылки'
								/>
							</th>
						)}

						<th>НАЗВАНИЕ</th>
						<th>КОРОТКИЙ URL</th>
						<th>КЛИКИ</th>
						<th>ТРЕНД</th>
						<th>СТАТУС</th>
						<th>СОЗДАНО</th>

						{showActions && <th>ДЕЙСТВИЯ</th>}
					</tr>
				</thead>
				<tbody>
					{links.map(link => (
						<LinkTableRow
							key={link.id}
							link={link}
							isSelected={selectedLinks.includes(link.id)}
							onSelectLink={onSelectLink}
							openKebabId={actions.openKebabId}
							actions={actions}
							allowSelection={allowSelection}
							showActions={showActions}
						/>
					))}
				</tbody>
			</table>

			{actions.qrModalLink && (
				<QrCodeModal
					link={actions.qrModalLink}
					onClose={actions.closeQrModal}
					onCopyUrl={actions.handleCopyQrUrl}
					onDownload={actions.handleDownloadQr}
				/>
			)}
		</div>
	)
}

export default LinksTable
