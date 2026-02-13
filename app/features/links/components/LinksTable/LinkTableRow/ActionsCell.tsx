'use client'

import { LinkItem } from '@/types/links'
import { BarChart3, Copy, MoreVertical, QrCode } from 'lucide-react'
import React from 'react'
import KebabMenuActions from '../../KebabMenuActions/KebabMenuActions'
import sharedStyles from '../shared.module.scss'
import styles from './LinkTableRow.module.scss'

interface ActionsCellProps {
	link: LinkItem
	openKebabId: string | null
	onCopy: (url: string, e?: React.MouseEvent) => void
	onQrClick: (link: LinkItem, e: React.MouseEvent) => void
	onAnalyticsClick: (linkId: string, e: React.MouseEvent) => void
	onKebabClick: (linkId: string, e: React.MouseEvent) => void
	kebabActions: {
		closeKebabMenu: (e: React.MouseEvent) => void
		handleEdit: (linkId: string) => void
		handleToggleStatus: (link: LinkItem) => void
		handleDelete: (linkId: string) => void
		handleRestore: (linkId: string) => void
	}
}

export default function ActionsCell({
	link,
	openKebabId,
	onCopy,
	onQrClick,
	onAnalyticsClick,
	onKebabClick,
	kebabActions
}: ActionsCellProps) {
	return (
		<td>
			<div className={styles.actions}>
				<button
					className={sharedStyles.actionBtn}
					onClick={e => onCopy(link.shortUrl, e)}
					title='Копировать'
				>
					<Copy size={16} />
				</button>
				<button
					className={sharedStyles.actionBtn}
					onClick={e => onQrClick(link, e)}
					title='QR код'
				>
					<QrCode size={16} />
				</button>
				<button
					className={sharedStyles.actionBtn}
					onClick={e => onAnalyticsClick(link.id, e)}
					title='Аналитика'
				>
					<BarChart3 size={16} />
				</button>
				<div className={sharedStyles.kebabWrapper}>
					<button
						className={sharedStyles.actionBtn}
						onClick={e => onKebabClick(link.id, e)}
						title='Ещё'
					>
						<MoreVertical size={16} />
					</button>
					<KebabMenuActions
						link={link}
						openKebabId={openKebabId}
						actions={kebabActions}
					/>
				</div>
			</div>
		</td>
	)
}
