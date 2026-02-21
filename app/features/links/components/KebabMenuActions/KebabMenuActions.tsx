'use client'

import { LinkItem as LinkItemType } from '@/types/links'
import cn from 'classnames'
import { Edit3, Pause, Play, RotateCcw, Trash2 } from 'lucide-react'
import React from 'react'
import { createPortal } from 'react-dom'
import styles from './KebabMenuActions.module.scss'

interface KebabMenuActionsProps {
	link: LinkItemType
	openKebabId: string | null
	anchorRef: React.RefObject<HTMLDivElement | null>
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
	anchorRef,
	actions
}: KebabMenuActionsProps) {
	const menuRef = React.useRef<HTMLDivElement>(null)
	const [menuStyle, setMenuStyle] = React.useState<React.CSSProperties>()
	const isOpen = openKebabId === link.id

	React.useLayoutEffect(() => {
		if (!isOpen) return

		const updatePosition = () => {
			if (!anchorRef.current) return

			if (window.matchMedia('(max-width: 768px)').matches) {
				setMenuStyle(undefined)
				return
			}

			const anchorRect = anchorRef.current.getBoundingClientRect()
			const menuHeight = menuRef.current?.offsetHeight ?? 0

			let top = anchorRect.bottom + 8
			if (top + menuHeight > window.innerHeight - 8) {
				top = Math.max(8, anchorRect.top - menuHeight - 8)
			}

			setMenuStyle({
				top: `${top}px`,
				left: `${anchorRect.right}px`
			})
		}

		updatePosition()
		window.addEventListener('resize', updatePosition)
		window.addEventListener('scroll', updatePosition, true)
		return () => {
			window.removeEventListener('resize', updatePosition)
			window.removeEventListener('scroll', updatePosition, true)
		}
	}, [anchorRef, isOpen])

	if (!isOpen) return null

	const menu = (
		<>
			<div
				className={styles.kebabOverlay}
				onClick={actions.closeKebabMenu}
			/>
			<div className={styles.kebabMenu} style={menuStyle} ref={menuRef}>
				<button
					className={styles.kebabItem}
					onClick={() => actions.handleEdit(link.id)}
				>
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
							className={cn(styles.kebabItem, styles.danger)}
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

	if (typeof document === 'undefined') return null
	return createPortal(menu, document.body)
}
