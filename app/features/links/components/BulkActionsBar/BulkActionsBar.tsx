'use client'

import cn from 'classnames'
import { Pause, Play, RotateCcw, Trash2, X } from 'lucide-react'
import styles from './BulkActionsBar.module.scss'

interface BulkActionsBarProps {
	selectedCount: number
	onClearSelection: () => void
	onPause: () => void
	onResume: () => void
	onRestore: () => void
	onDelete: () => void
	canPauseBulk: boolean
	canResumeBulk: boolean
	canRestoreBulk: boolean
	canDeleteBulk: boolean
}

export default function BulkActionsBar({
	selectedCount,
	onClearSelection,
	onPause,
	onResume,
	onRestore,
	onDelete,
	canPauseBulk,
	canResumeBulk,
	canRestoreBulk,
	canDeleteBulk
}: BulkActionsBarProps) {
	if (selectedCount === 0) return null

	return (
		<div className={styles.bar}>
			<div className={styles.info}>
				<button
					className={styles.clearButton}
					onClick={onClearSelection}
					aria-label='Снять выделение'
				>
					<X size={16} />
				</button>
				<span className={styles.count}>
					Выбрано: <strong>{selectedCount}</strong>
				</span>
			</div>

			<div className={styles.actions}>
				{canPauseBulk && (
					<button
						className={styles.actionButton}
						onClick={onPause}
					>
						<Pause size={16} />
						<span>Приостановить</span>
					</button>
				)}

				{canResumeBulk && (
					<button
						className={styles.actionButton}
						onClick={onResume}
					>
						<Play size={16} />
						<span>Возобновить</span>
					</button>
				)}

				{canRestoreBulk && (
					<button
						className={styles.actionButton}
						onClick={onRestore}
					>
						<RotateCcw size={16} />
						<span>Восстановить</span>
					</button>
				)}

				{canDeleteBulk && (
					<button
						className={cn(styles.actionButton, styles.destructive)}
						onClick={onDelete}
					>
						<Trash2 size={16} />
						<span>Удалить</span>
					</button>
				)}
			</div>
		</div>
	)
}
