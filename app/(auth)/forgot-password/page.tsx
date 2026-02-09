'use client'

import Button from '@/app/components/ui/Button'
import { ArrowLeft, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './page.module.scss'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<div className={styles.page}>
			<div className={styles.logo}>
				<div className={styles.logoIcon}>
					<LinkIcon size={24} />
				</div>
				<span className={styles.logoText}>trim.ly</span>
			</div>

			<div className={styles.card}>
				<div className={styles.cardHeader}>
					<h1 className={styles.cardTitle}>Сбросить пароль</h1>
					<p className={styles.cardSubtitle}>
						Введите email и мы отправим вам ссылку для сброса.
					</p>
				</div>

				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<div className={styles.formGroup}>
						<label
							className={styles.label}
							htmlFor='email'
						>
							Email адрес
						</label>
						<input
							id='email'
							type='email'
							className={styles.input}
							placeholder='name@company.com'
							value={email}
							onChange={e => setEmail(e.target.value)}
							autoComplete='email'
						/>
					</div>

					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						Отправить ссылку
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
