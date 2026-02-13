import Button from '@/app/components/ui/Button/Button'
import { LinkStatus } from '@/types/links'
import { Pause, Pencil, Play, QrCode, RotateCcw, Trash2 } from 'lucide-react'
import styles from './LinkActions.module.scss'

interface LinkActionsProps {
	status: LinkStatus
	onEdit: () => void
	onPause: () => void
	onResume: () => void
	onRestore: () => void
	onDelete: () => void
	onDownloadQr: () => void
	hideEditButton?: boolean
}

export default function LinkActions({
	status,
	onEdit,
	onPause,
	onResume,
	onRestore,
	onDelete,
	onDownloadQr,
	hideEditButton = false
}: LinkActionsProps) {
	const isActive = status === 'active'
	const isPaused = status === 'paused'
	const isDeleted = status === 'deleted'
	const canToggleStatus = isActive || isPaused

	return (
		<div className={styles.actions}>
			{!hideEditButton && (
				<Button variant='outline' size='md' onClick={onEdit}>
					<Pencil size={16} />
					<span>Редактировать</span>
				</Button>
			)}

			{canToggleStatus && (
				<>
					{isActive ? (
						<Button variant='outline' size='md' onClick={onPause}>
							<Pause size={16} />
							<span>Пауза</span>
						</Button>
					) : (
						<Button variant='outline' size='md' onClick={onResume}>
							<Play size={16} />
							<span>Возобновить</span>
						</Button>
					)}
				</>
			)}

			{isDeleted ? (
				<Button variant='outline' size='md' onClick={onRestore}>
					<RotateCcw size={16} />
					<span>Восстановить</span>
				</Button>
			) : (
				<Button
					variant='outline'
					size='md'
					onClick={onDelete}
					className={styles.deleteBtn}
				>
					<Trash2 size={16} />
					<span>Удалить</span>
				</Button>
			)}

			<Button variant='primary' size='md' onClick={onDownloadQr}>
				<QrCode size={16} />
				<span>Скачать QR</span>
			</Button>
		</div>
	)
}
