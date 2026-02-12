import Button from '@/app/components/ui/Button/Button'
import NoticeBanner from '@/app/components/ui/NoticeBanner/NoticeBanner'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import stylesCommon from '../settingsCommon.module.scss'
import TabCard from '../TabCard'
import PasswordStrength from './components/PasswordStrength'
import useSecurityTab from './hooks/useSecurityTab'
import styles from './SecureTab.module.scss'

export default function SecurityTab() {
	const vm = useSecurityTab()

	return (
		<TabCard
			title='Безопасность'
			subtitle='Управляйте паролем и двухфакторной аутентификацией.'
		>
			<>
				<div className={styles.formWrapper}>
					<div className={stylesCommon.formSingle}>
						<PasswordInput
							id='currentPassword'
							label='текущий пароль'
							labelStyle='secondary'
							placeholder='Введите текущий пароль'
							value={vm.currentPassword}
							onChange={e =>
								vm.setCurrentPassword(e.target.value)
							}
							autoComplete='current-password'
							error={vm.fieldErrors.currentPassword}
						/>
					</div>
					<div className={stylesCommon.formGroup}>
						<PasswordInput
							id='newPassword'
							label='новый пароль'
							labelStyle='secondary'
							placeholder='Введите новый пароль'
							value={vm.newPassword}
							onChange={e => vm.setNewPassword(e.target.value)}
							autoComplete='new-password'
							error={vm.fieldErrors.newPassword}
						/>

						<PasswordInput
							id='confirmPassword'
							label='подтвердите пароль'
							labelStyle='secondary'
							placeholder='Повторите новый пароль'
							value={vm.confirmPassword}
							onChange={e =>
								vm.setConfirmPassword(e.target.value)
							}
							autoComplete='new-password'
							error={vm.fieldErrors.confirmPassword}
						/>
					</div>
				</div>
				<div className={styles.strengthRow}>
					{vm.newPassword && (
						<PasswordStrength
							score={vm.strength.score}
							label={vm.strength.label}
							tone={vm.strength.tone}
						/>
					)}
				</div>
				<div className={stylesCommon.notices}>
					<NoticeBanner
						message={vm.error}
						type='error'
					/>
					<NoticeBanner
						message={vm.success}
						type='success'
					/>
				</div>
				<div className={stylesCommon.actionsRow}>
					<Button
						variant='primary'
						size='md'
						onClick={vm.handleSubmit}
						disabled={!vm.canSubmit || vm.isSaving}
					>
						{vm.isSaving ? 'Сохраняем...' : 'Обновить пароль'}
					</Button>
				</div>
			</>
		</TabCard>
	)
}
