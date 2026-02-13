'use client'

import ToggleSwitch from '@/app/components/ui/ToggleSwitch/ToggleSwitch'
import { usePasswordToggle } from '@/hooks/usePasswordToggle'
import { Eye, EyeOff, Lock } from 'lucide-react'
import React, { useCallback } from 'react'
import styles from './LinkEdit.module.scss'

interface PasswordSettingsProps {
	passwordEnabled: boolean
	password: string
	passwordError?: string
	hasExistingPassword: boolean
	onPasswordToggle: () => void
	onPasswordChange: (value: string) => void
}

export default function PasswordSettings({
	passwordEnabled,
	password,
	passwordError,
	hasExistingPassword,
	onPasswordToggle,
	onPasswordChange
}: PasswordSettingsProps) {
	const { showPassword, togglePassword } = usePasswordToggle()

	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onPasswordChange(e.target.value)
		},
		[onPasswordChange]
	)

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>
				<Lock size={16} />
				Защита паролем
			</label>
			<div className={styles.passwordSection}>
				<ToggleSwitch
					checked={passwordEnabled}
					onChange={onPasswordToggle}
				/>
				{passwordEnabled && (
					<>
						<div className={styles.passwordInputWrapper}>
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={password}
								onChange={handlePasswordChange}
								placeholder='Установить новый пароль'
								className={`${styles.input} ${styles.passwordInput}`}
							/>
							<button
								type='button'
								className={styles.passwordToggle}
								onClick={togglePassword}
								aria-label={
									showPassword
										? 'Скрыть пароль'
										: 'Показать пароль'
								}
							>
								{showPassword ? (
									<EyeOff size={16} />
								) : (
									<Eye size={16} />
								)}
							</button>
						</div>
						{hasExistingPassword && (
							<span className={styles.hint}>
								Оставьте пустым, чтобы сохранить текущий пароль.
							</span>
						)}
						{passwordError && (
							<span className={styles.fieldError}>
								{passwordError}
							</span>
						)}
					</>
				)}
			</div>
		</div>
	)
}
