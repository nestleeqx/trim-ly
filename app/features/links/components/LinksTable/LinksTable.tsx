'use client'

import { useLinkActions } from '@/app/features/links/hooks/useLinkActions'
import QrCodeModal from '../QrCodeModal/QrCodeModal'
import styles from './LinksTable.module.scss'
import LinkTableRow from './LinkTableRow/LinkTableRow'
import sharedStyles from './shared.module.scss'
import { LinksTableProps } from './types'

export default function LinksTable({
	links,
	selectedLinks,
	onSelectAll,
	onSelectLink,
	onCopy,
	onEdit,
	onDelete,
	onPause,
	onResume,
	onRestore,
	title,
	allLinksHref,
	allowSelection = true,
	showActions = true,
	showTrend = true
}: LinksTableProps) {
	const allSelected =
		links.length > 0 && selectedLinks.length === links.length

	const actions = useLinkActions({
		onCopy,
		onEdit,
		onDelete,
		onPause,
		onResume,
		onRestore
	})

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
						{showTrend && <th>ТРЕНД</th>}
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
							showTrend={showTrend}
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
