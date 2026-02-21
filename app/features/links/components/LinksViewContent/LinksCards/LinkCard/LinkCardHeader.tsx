'use client'

import sharedStyles from '@/app/features/links/components/LinksTable/shared.module.scss'
import { LinkItem as LinkItemType } from '@/types/links'
import cn from 'classnames'
import { MoreVertical } from 'lucide-react'
import KebabMenuActions from '../../../KebabMenuActions/KebabMenuActions'
import { LinkActions } from '../../../LinksTable/LinkTableRow/types'
import { getStatusClass } from '../../../LinksTable/shared'
import { getStatusLabel } from '@/utils/link-helpers'
import styles from './LinkCard.module.scss'
import { useRef } from 'react'

interface LinkCardHeaderProps {
	link: LinkItemType
	isSelected: boolean
	openKebabId: string | null
	onSelectLink: (id: string, checked: boolean) => void
	stop: (e: React.SyntheticEvent) => void
	actions: LinkActions
}

export default function LinkCardHeader({
	link,
	isSelected,
	openKebabId,
	onSelectLink,
	stop,
	actions
}: LinkCardHeaderProps) {
	const kebabAnchorRef = useRef<HTMLDivElement>(null)

	return (
		<div className={styles.cardHeader}>
			<div className={styles.checkboxWrapper}>
				<input
					type='checkbox'
					checked={isSelected}
					className={sharedStyles.checkbox}
					aria-label={`Выбрать ${link.title}`}
					onClick={stop}
					onChange={e => onSelectLink(link.id, e.target.checked)}
				/>
			</div>

			<span
				className={cn(sharedStyles.status, getStatusClass(link.status))}
			>
				{getStatusLabel(link.status)}
			</span>

			<div className={styles.kebabActions}>
				<div className={sharedStyles.kebabWrapper} ref={kebabAnchorRef}>
					<button
						type='button'
						className={sharedStyles.actionBtn}
						title='Ещё'
						onClick={e => actions.handleKebabClick(link.id, e)}
					>
						<MoreVertical size={16} />
					</button>

					<KebabMenuActions
						link={link}
						openKebabId={openKebabId}
						anchorRef={kebabAnchorRef}
						actions={{
							closeKebabMenu: actions.closeKebabMenu,
							handleEdit: actions.handleEdit,
							handleToggleStatus: actions.handleToggleStatus,
							handleDelete: actions.handleDelete,
							handleRestore: actions.handleRestore
						}}
					/>
				</div>
			</div>
		</div>
	)
}
