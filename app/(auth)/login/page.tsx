'use client'

import { AuthCard } from '@/app/components/auth/AuthCard'
import { AuthDivider } from '@/app/components/auth/AuthDivider'
import { AuthPageLayout } from '@/app/components/auth/AuthPageLayout'
import { FormField } from '@/app/components/auth/FormField'
import { PasswordInput } from '@/app/components/auth/PasswordInput'
import { SocialAuthButtons } from '@/app/components/auth/SocialAuthButtons'
import Button from '@/app/components/ui/Button'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './page.module.scss'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [remember, setRemember] = useState(false)

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<AuthPageLayout>
			<AuthCard
				title='С возвращением'
				subtitle='Войдите, чтобы управлять ссылками и аналитикой.'
			>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<FormField
						id='email'
						label='Email адрес'
						type='email'
						placeholder='name@company.com'
						value={email}
						onChange={e => setEmail(e.target.value)}
						autoComplete='email'
					/>
					<PasswordInput
						id='password'
						label='Пароль'
						placeholder='••••••••'
						value={password}
						onChange={e => setPassword(e.target.value)}
						autoComplete='current-password'
						showForgotLink={true}
						forgotLinkClassName={styles.forgotLink}
					/>
					<div className={styles.rememberRow}>
						<input
							id='remember'
							type='checkbox'
							className={styles.checkbox}
							checked={remember}
							onChange={e => setRemember(e.target.checked)}
						/>
						<label
							htmlFor='remember'
							className={styles.rememberLabel}
						>
							Запомнить меня
						</label>
					</div>
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						Войти
					</Button>
					<AuthDivider text='Или продолжить с' />
					<SocialAuthButtons />
					<p className={styles.footerText}>
						Нет аккаунта?{' '}
						<Link
							href='/signup'
							className={styles.signupLink}
						>
							Зарегистрироваться
						</Link>
					</p>
				</form>
			</AuthCard>
		</AuthPageLayout>
	)
}
