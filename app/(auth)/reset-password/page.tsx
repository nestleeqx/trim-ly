'use client'

import Button from '@/app/components/ui/Button'
import { ArrowLeft, Eye, EyeOff, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './page.module.scss'

export default function ResetPasswordPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const togglePassword = useCallback(() => {
		setShowPassword(prev => !prev)
	}, [])

	const toggleConfirmPassword = useCallback(() => {
		setShowConfirmPassword(prev => !prev)
	}, [])

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<div className={styles.page}>
			{/* Logo */}
			<div className={styles.logo}>
				<div className={styles.logoIcon}>
					<LinkIcon size={24} />
				</div>
				<span className={styles.logoText}>trim.ly</span>
			</div>

			{/* Card */}
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
					{/* New Password */}
					<div className={styles.formGroup}>
						<label
							className={styles.label}
							htmlFor='password'
						>
							Новый пароль
						</label>
						<div className={styles.inputWrapper}>
							<input
								id='password'
								type={showPassword ? 'text' : 'password'}
								className={styles.input}
								placeholder='Создайте надёжный пароль'
								value={password}
								onChange={e => setPassword(e.target.value)}
								autoComplete='new-password'
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
									<EyeOff size={18} />
								) : (
									<Eye size={18} />
								)}
							</button>
						</div>
					</div>

					{/* Confirm Password */}
					<div className={styles.formGroup}>
						<label
							className={styles.label}
							htmlFor='confirmPassword'
						>
							Подтвердите пароль
						</label>
						<div className={styles.inputWrapper}>
							<input
								id='confirmPassword'
								type={showConfirmPassword ? 'text' : 'password'}
								className={styles.input}
								placeholder='Повторите пароль'
								value={confirmPassword}
								onChange={e =>
									setConfirmPassword(e.target.value)
								}
								autoComplete='new-password'
							/>
							<button
								type='button'
								className={styles.passwordToggle}
								onClick={toggleConfirmPassword}
								aria-label={
									showConfirmPassword
										? 'Скрыть пароль'
										: 'Показать пароль'
								}
							>
								{showConfirmPassword ? (
									<EyeOff size={18} />
								) : (
									<Eye size={18} />
								)}
							</button>
						</div>
					</div>

					{/* Submit */}
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						Сохранить пароль
					</Button>

					{/* Login link */}
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

			{/* Back */}
			<Link
				href='/'
				className={styles.backLink}
			>
				<ArrowLeft size={16} />
				Вернуться на главную
			</Link>
		</div>
	)
}
