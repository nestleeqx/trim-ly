'use client'

import { Pause, Play, Trash2, X } from 'lucide-react'
import styles from './BulkActionsBar.module.scss'

interface BulkActionsBarProps {
	selectedCount: number
	onClearSelection: () => void
	onPause: () => void
	onResume: () => void
	onDelete: () => void
	canPauseBulk: boolean
	canResumeBulk: boolean
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
	selectedCount,
	onClearSelection,
	onPause,
	onResume,
	onDelete,
	canPauseBulk,
	canResumeBulk
}) => {
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
					<button className={styles.actionButton} onClick={onPause}>
						<Pause size={16} />
						<span>Приостановить</span>
					</button>
				)}

				{canResumeBulk && (
					<button className={styles.actionButton} onClick={onResume}>
						<Play size={16} />
						<span>Возобновить</span>
					</button>
				)}

				<button
					className={`${styles.actionButton} ${styles.destructive}`}
					onClick={onDelete}
				>
					<Trash2 size={16} />
					<span>Удалить</span>
				</button>
			</div>
		</div>
	)
}

export default BulkActionsBar
