import Button from '@/app/components/ui/Button/Button'
import FormField from '@/app/components/ui/FormField/FormField'
import Modal from '@/app/components/ui/Modal/Modal'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import commonStyles from '../../DangerTab.module.scss'
import styles from './DeleteAccountModal.module.scss'

type DeleteAccountModalProps = {
	isOpen: boolean
	password: string
	confirmationText: string
	requiresPassword: boolean
	isDeleteAuthModeLoading: boolean
	error: string | null
	isDeleting: boolean
	onPasswordChange: (value: string) => void
	onConfirmationTextChange: (value: string) => void
	onClose: () => void
	onConfirm: () => void
}

export default function DeleteAccountModal({
	isOpen,
	password,
	confirmationText,
	requiresPassword,
	isDeleteAuthModeLoading,
	error,
	isDeleting,
	onPasswordChange,
	onConfirmationTextChange,
	onClose,
	onConfirm
}: DeleteAccountModalProps) {
	const canConfirm = requiresPassword
		? Boolean(password.trim())
		: confirmationText.trim() === 'DELETE'
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Подтверждение удаления'
		>
			<div className={styles.modalBody}>
				<p className={styles.modalText}>
					{requiresPassword
						? 'Введите пароль, чтобы подтвердить удаление аккаунта.'
						: 'Для удаления OAuth-аккаунта введите DELETE.'}
				</p>

				{isDeleteAuthModeLoading ? (
					<p className={styles.modalText}>
						Проверяем тип аккаунта...
					</p>
				) : requiresPassword ? (
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
				) : (
					<FormField
						id='delete-account-confirmation'
						label='Подтверждение'
						placeholder='Введите DELETE'
						value={confirmationText}
						onChange={e => onConfirmationTextChange(e.target.value)}
						autoComplete='off'
						error={error ?? undefined}
						hint='Введите DELETE в верхнем регистре.'
					/>
				)}

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
						disabled={
							isDeleting || isDeleteAuthModeLoading || !canConfirm
						}
					>
						{isDeleting ? 'Удаляем...' : 'Удалить аккаунт'}
					</Button>
				</div>
			</div>
		</Modal>
	)
}
