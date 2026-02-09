import { LinkStatus } from '@/types/links'
import { Pause, Pencil, Play, QrCode, Trash2 } from 'lucide-react'
import Button from '../Button'
import styles from './LinkActions.module.scss'

interface LinkActionsProps {
	status: LinkStatus
	onEdit: () => void
	onPause: () => void
	onResume: () => void
	onDelete: () => void
	onDownloadQr: () => void
	hideEditButton?: boolean
}

const LinkActions: React.FC<LinkActionsProps> = ({
	status,
	onEdit,
	onPause,
	onResume,
	onDelete,
	onDownloadQr,
	hideEditButton = false
}) => {
	const isActive = status === 'active'
	const isPaused = status === 'paused'
	const canToggleStatus = isActive || isPaused

	return (
		<div className={styles.actions}>
			{!hideEditButton && (
				<Button
					variant='outline'
					size='md'
					onClick={onEdit}
				>
					<Pencil size={16} />
					<span>Редактировать</span>
				</Button>
			)}

			{canToggleStatus && (
				<>
					{isActive ? (
						<Button
							variant='outline'
							size='md'
							onClick={onPause}
						>
							<Pause size={16} />
							<span>Пауза</span>
						</Button>
					) : (
						<Button
							variant='outline'
							size='md'
							onClick={onResume}
						>
							<Play size={16} />
							<span>Возобновить</span>
						</Button>
					)}
				</>
			)}

			<Button
				variant='outline'
				size='md'
				onClick={onDelete}
				className={styles.deleteBtn}
			>
				<Trash2 size={16} />
				<span>Удалить</span>
			</Button>

			<Button
				variant='primary'
				size='md'
				onClick={onDownloadQr}
			>
				<QrCode size={16} />
				<span>Скачать QR</span>
			</Button>
		</div>
	)
}

export default LinkActions
