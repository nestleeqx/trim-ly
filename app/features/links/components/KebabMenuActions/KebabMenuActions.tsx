'use client'

import { LinkItem as LinkItemType } from '@/types/links'
import { Edit3, Pause, Play, RotateCcw, Trash2 } from 'lucide-react'
import React from 'react'
import styles from './KebabMenuActions.module.scss'

interface KebabMenuActionsProps {
	link: LinkItemType
	openKebabId: string | null
	actions: {
		closeKebabMenu: (e: React.MouseEvent) => void
		handleEdit: (linkId: string) => void
		handleToggleStatus: (link: LinkItemType) => void
		handleDelete: (linkId: string) => void
		handleRestore: (linkId: string) => void
	}
}

export default function KebabMenuActions({
	link,
	openKebabId,
	actions
}: KebabMenuActionsProps) {
	if (openKebabId !== link.id) return null

	return (
		<>
			<div className={styles.kebabOverlay} onClick={actions.closeKebabMenu} />
			<div className={styles.kebabMenu}>
				<button className={styles.kebabItem} onClick={() => actions.handleEdit(link.id)}>
					<Edit3 size={16} />
					<span>Редактировать</span>
				</button>

				{link.status === 'active' && (
					<button
						className={styles.kebabItem}
						onClick={() => actions.handleToggleStatus(link)}
					>
						<Pause size={16} />
						<span>Приостановить</span>
					</button>
				)}

				{link.status === 'paused' && (
					<button
						className={styles.kebabItem}
						onClick={() => actions.handleToggleStatus(link)}
					>
						<Play size={16} />
						<span>Возобновить</span>
					</button>
				)}

				{link.status === 'deleted' && (
					<button
						className={styles.kebabItem}
						onClick={() => actions.handleRestore(link.id)}
					>
						<RotateCcw size={16} />
						<span>Восстановить</span>
					</button>
				)}

				{link.status !== 'deleted' && (
					<>
						<div className={styles.kebabDivider} />
						<button
							className={`${styles.kebabItem} ${styles.danger}`}
							onClick={() => actions.handleDelete(link.id)}
						>
							<Trash2 size={16} />
							<span>Удалить</span>
						</button>
					</>
				)}
			</div>
		</>
	)
}
