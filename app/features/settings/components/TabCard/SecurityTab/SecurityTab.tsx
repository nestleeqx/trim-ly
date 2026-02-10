import Button from '@/app/components/ui/Button/Button'
import { useState } from 'react'
import stylesCommon from '../settingsCommon.module.scss'
import TabCard from '../TabCard'
import styles from './SecureTab.module.scss'

export default function SecurityTab() {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const getPasswordStrength = (
		pass: string
	): { strength: number; label: string } => {
		let strength = 0
		if (pass.length >= 8) strength++
		if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++
		if (/\d/.test(pass)) strength++
		if (/[^a-zA-Z0-9]/.test(pass)) strength++

		const labels = ['СЛАБЫЙ', 'СРЕДНИЙ', 'ХОРОШИЙ', 'СИЛЬНЫЙ']
		return { strength, label: labels[strength - 1] || 'СЛАБЫЙ' }
	}

	const { strength, label } = getPasswordStrength(password)

	return (
		<TabCard
			title='Безопасность'
			subtitle='Управляйте паролем и двухфакторной аутентификацией.'
		>
			<>
				<div className={styles.formWrapper}>
					<div className={stylesCommon.formSingle}>
						<label className={stylesCommon.fieldLabel}>
							ТЕКУЩИЙ ПАРОЛЬ
						</label>
						<input
							type='password'
							className={stylesCommon.input}
							placeholder='••••••••'
						/>
					</div>
					<div className={stylesCommon.formGrid}>
						<div className={stylesCommon.formGroup}>
							<label className={stylesCommon.fieldLabel}>
								НОВЫЙ ПАРОЛЬ
							</label>
							<input
								type='password'
								className={stylesCommon.input}
								placeholder='********'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
						<div className={stylesCommon.formGroup}>
							<label className={stylesCommon.fieldLabel}>
								ПОДТВЕРДИТЕ ПАРОЛЬ
							</label>
							<input
								type='password'
								className={stylesCommon.input}
								placeholder='********'
								value={confirmPassword}
								onChange={e =>
									setConfirmPassword(e.target.value)
								}
							/>
						</div>
					</div>
				</div>
				<div className={styles.strengthRow}>
					<span className={styles.strengthLabel}>СИЛА ПАРОЛЯ</span>
					<span
						className={`${styles.strengthValue} ${styles[`strength${strength}`]}`}
					>
						{label}
					</span>
				</div>
				<div className={styles.strengthBar}>
					<div
						className={`${styles.strengthFill} ${styles[`fill${strength}`]}`}
						style={{ width: `${(strength / 4) * 100}%` }}
					/>
				</div>
				<div className={stylesCommon.actionsRow}>
					<Button variant='primary'>Обновить пароль</Button>
				</div>
			</>
		</TabCard>
	)
}
