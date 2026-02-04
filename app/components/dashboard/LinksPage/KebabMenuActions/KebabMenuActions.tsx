'use client'

import { LinkItem as LinkItemType } from '@/types/links'
import { Edit3, Pause, Play, Trash2 } from 'lucide-react'
import sharedStyles from '../../LinksPage/shared.module.scss'
import React from 'react'

interface KebabMenuActionsProps {
	link: LinkItemType
	openKebabId: string | null
	actions: {
		closeKebabMenu: (e: React.MouseEvent) => void
		handleEdit: (linkId: string) => void
		handleToggleStatus: (link: LinkItemType) => void
		handleDelete: (linkId: string) => void
	}
}

export const KebabMenuActions: React.FC<KebabMenuActionsProps> = ({
	link,
	openKebabId,
	actions
}) => {
	if (openKebabId !== link.id) return null

	return (
		<>
			<div
				className={sharedStyles.kebabOverlay}
				onClick={actions.closeKebabMenu}
			/>
			<div className={sharedStyles.kebabMenu}>
				<button
					className={sharedStyles.kebabItem}
					onClick={() => actions.handleEdit(link.id)}
				>
					<Edit3 size={16} />
					<span>Редактировать</span>
				</button>
				{link.status === 'active' && (
					<button
						className={sharedStyles.kebabItem}
						onClick={() => actions.handleToggleStatus(link)}
					>
						<Pause size={16} />
						<span>Приостановить</span>
					</button>
				)}
				{link.status === 'paused' && (
					<button
						className={sharedStyles.kebabItem}
						onClick={() => actions.handleToggleStatus(link)}
					>
						<Play size={16} />
						<span>Возобновить</span>
					</button>
				)}

				<div className={sharedStyles.kebabDivider} />
				<button
					className={`${sharedStyles.kebabItem} ${sharedStyles.danger}`}
					onClick={() => actions.handleDelete(link.id)}
				>
					<Trash2 size={16} />
					<span>Удалить</span>
				</button>
			</div>
		</>
	)
}