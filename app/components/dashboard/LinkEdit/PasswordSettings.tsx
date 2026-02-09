'use client'

import ToggleSwitch from '@/app/components/ui/ToggleSwitch/ToggleSwitch'
import { Lock } from 'lucide-react'
import React, { useCallback } from 'react'
import styles from './LinkEdit.module.scss'

interface PasswordSettingsProps {
	passwordEnabled: boolean
	password: string
	hasExistingPassword: boolean
	onPasswordToggle: () => void
	onPasswordChange: (value: string) => void
}

export const PasswordSettings: React.FC<PasswordSettingsProps> = ({
	passwordEnabled,
	password,
	hasExistingPassword,
	onPasswordToggle,
	onPasswordChange
}) => {
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
						<input
							type='password'
							name='password'
							value={password}
							onChange={handlePasswordChange}
							placeholder='Установить новый пароль'
							className={styles.input}
						/>
						{hasExistingPassword && (
							<span className={styles.hint}>
								Оставьте пустым, чтобы сохранить текущий пароль.
							</span>
						)}
					</>
				)}
			</div>
		</div>
	)
}
