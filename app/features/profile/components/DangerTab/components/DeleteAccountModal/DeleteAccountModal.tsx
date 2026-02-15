import Button from '@/app/components/ui/Button/Button'
import Modal from '@/app/components/ui/Modal/Modal'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import commonStyles from '../../DangerTab.module.scss'
import styles from './DeleteAccountModal.module.scss'

type DeleteAccountModalProps = {
	isOpen: boolean
	password: string
	error: string | null
	isDeleting: boolean
	onPasswordChange: (value: string) => void
	onClose: () => void
	onConfirm: () => void
}

export default function DeleteAccountModal({
	isOpen,
	password,
	error,
	isDeleting,
	onPasswordChange,
	onClose,
	onConfirm
}: DeleteAccountModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Подтверждение удаления'
		>
			<div className={styles.modalBody}>
				<p className={styles.modalText}>
					Введите пароль, чтобы подтвердить удаление аккаунта.
				</p>

				<PasswordInput
					id='delete-account-password'
					label='Пароль'
					labelStyle='secondary'
					placeholder='Введите пароль'
					value={password}
					onChange={e => onPasswordChange(e.target.value)}
					autoComplete='current-password'
					showForgotLink={false}
					error={error ?? undefined}
				/>

				<div className={styles.modalActions}>
					<Button
						variant='ghost'
						onClick={onClose}
						disabled={isDeleting}
					>
						Отмена
					</Button>
					<Button
						variant='outline'
						className={commonStyles.deleteBtn}
						onClick={onConfirm}
						disabled={isDeleting || !password.trim()}
					>
						{isDeleting ? 'Удаляем...' : 'Удалить аккаунт'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
