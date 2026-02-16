'use client'

import Button from '@/app/components/ui/Button/Button'
import cn from 'classnames'
import { Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './StatesCommon.module.scss'

interface PasswordStateProps {
	slug: string
}

export default function PasswordState({ slug }: PasswordStateProps) {
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const togglePassword = useCallback(() => {
		setShowPassword(prev => !prev)
	}, [])

	const handlePasswordChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(e.target.value)
			if (error) setError(null)
		},
		[error]
	)

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault()
			if (!password || isSubmitting) return

			setIsSubmitting(true)
			setError(null)

			try {
				const response = await fetch(`/api/slug/${slug}/unlock`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password })
				})

				const data = await response.json().catch(() => null)
				if (!response.ok || !data?.targetUrl) {
					setError(data?.error || 'Не удалось открыть ссылку')
					return
				}

				window.location.replace(data.targetUrl)
			} catch {
				setError('Сетевая ошибка. Попробуйте ещё раз.')
			} finally {
				setIsSubmitting(false)
			}
		},
		[password, isSubmitting, slug]
	)

	return (
		<div className={styles.card}>
			<div className={cn(styles.stateIcon, styles.stateIconPurple)}>
				<Lock size={24} />
			</div>

			<h1 className={styles.cardTitle}>Ссылка защищена</h1>
			<p className={styles.cardSubtitle}>
				Введите пароль для продолжения.
			</p>

			<form
				className={styles.form}
				onSubmit={handleSubmit}
			>
				<div className={styles.inputWrapper}>
					<input
						type={showPassword ? 'text' : 'password'}
						className={styles.input}
						placeholder='••••••••'
						value={password}
						onChange={handlePasswordChange}
						autoComplete='off'
					/>
					<button
						type='button'
						className={styles.passwordToggle}
						onClick={togglePassword}
						aria-label={
							showPassword ? 'Скрыть пароль' : 'Показать пароль'
						}
					>
						{showPassword ? (
							<EyeOff size={18} />
						) : (
							<Eye size={18} />
						)}
					</button>
				</div>

				{error ? <p className={styles.formError}>{error}</p> : null}

				<Button
					variant='primary'
					type='submit'
					size='lg'
					disabled={!password || isSubmitting}
				>
					{isSubmitting ? 'Проверяем...' : 'Разблокировать ссылку'}
				</Button>
			</form>

			<Link
				href='/'
				className={styles.goBackLink}
			>
				Назад
			</Link>
		</div>
	)
}
