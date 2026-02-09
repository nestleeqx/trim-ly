'use client'

import { AuthLogo } from '@/app/components/auth/AuthLogo'
import { BackToHomeLink } from '@/app/components/auth/BackToHomeLink'
import { PasswordInput } from '@/app/components/auth/PasswordInput'
import Button from '@/app/components/ui/Button'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './page.module.scss'

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<div className={styles.page}>
			<AuthLogo />
			<div className={styles.card}>
				<div className={styles.cardHeader}>
					<h1 className={styles.cardTitle}>Новый пароль</h1>
					<p className={styles.cardSubtitle}>
						Введите новый пароль для вашего аккаунта.
					</p>
				</div>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<PasswordInput
						id='password'
						label='Новый пароль'
						placeholder='Создайте надёжный пароль'
						value={password}
						onChange={e => setPassword(e.target.value)}
						autoComplete='new-password'
					/>
					<PasswordInput
						id='confirmPassword'
						label='Подтвердите пароль'
						placeholder='Повторите пароль'
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						autoComplete='new-password'
					/>
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						Сохранить пароль
					</Button>
					<p className={styles.footerText}>
						Вспомнили пароль?{' '}
						<Link
							href='/login'
							className={styles.loginLink}
						>
							Вернуться ко входу
						</Link>
					</p>
				</form>
			</div>
			<BackToHomeLink />
		</div>
	)
}
