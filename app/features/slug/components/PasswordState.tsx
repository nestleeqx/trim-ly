import Button from '@/app/components/ui/Button/Button'
import { Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './StatesCommon.module.scss'

export default function PasswordState() {
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const togglePassword = useCallback(() => {
		setShowPassword(prev => !prev)
	}, [])

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconPurple}`}>
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
						onChange={e => setPassword(e.target.value)}
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

				<Button
					variant='primary'
					type='submit'
					size='lg'
				>
					Разблокировать ссылку
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
