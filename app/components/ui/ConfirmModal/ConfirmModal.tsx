'use client'

import { AlertTriangle } from 'lucide-react'
import Modal from '../Modal/Modal'
import Button from '../Button/Button'
import styles from './ConfirmModal.module.scss'

interface ConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmText?: string
	cancelText?: string
	variant?: 'danger' | 'warning'
	loading?: boolean
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Подтвердить',
	cancelText = 'Отмена',
	variant = 'danger',
	loading = false
}) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<div className={styles.content}>
				<div className={`${styles.icon} ${styles[variant]}`}>
					<AlertTriangle size={32} />
				</div>
				<p className={styles.message}>{message}</p>
				<div className={styles.actions}>
					<Button variant='ghost' onClick={onClose} disabled={loading}>
						{cancelText}
					</Button>
					<button
						className={`${styles.confirmButton} ${styles[variant]}`}
						onClick={onConfirm}
						disabled={loading}
					>
						{loading ? 'Загрузка...' : confirmText}
					</button>
				</div>
			</div>
		</Modal>
	)
}

export default ConfirmModal
