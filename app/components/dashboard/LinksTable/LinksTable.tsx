'use client'

import { useLinkActions } from '@/hooks/useLinkActions'
import { LinkItem as LinkItemType } from '@/types/links'
import React from 'react'
import sharedStyles from '../LinksPage/shared.module.scss'
import { QrCodeModal } from '../QrCodeModal/QrCodeModal'
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
}

const LinksTable: React.FC<LinksTableProps> = ({
	links,
	selectedLinks,
	onSelectAll,
	onSelectLink,
	onCopy,
	onDelete,
	onPause,
	onResume
}) => {
	const allSelected =
		links.length > 0 && selectedLinks.length === links.length

	const actions = useLinkActions({ onCopy, onDelete, onPause, onResume })

	return (
		<div className={styles.tableWrapper}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.checkboxCell}>
							<input
								type='checkbox'
								checked={allSelected}
								onChange={e => onSelectAll(e.target.checked)}
								className={sharedStyles.checkbox}
								aria-label='Выбрать все ссылки'
							/>
						</th>
						<th>НАЗВАНИЕ</th>
						<th>КОРОТКИЙ URL</th>
						<th>КЛИКИ</th>
						<th>СТАТУС</th>
						<th>СОЗДАНО</th>
						<th>ДЕЙСТВИЯ</th>
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
