'use client'

import styles from '@/app/(auth)/login/page.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthDivider from '@/app/features/auth/components/AuthDivider/AuthDivider'
import FormField from '@/app/features/auth/components/FormContent/FormField'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import SocialAuthButtons from '@/app/features/auth/components/SocialAuthButtons/SocialAuthButtons'
import Link from 'next/link'
import { useCallback, useState } from 'react'

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
					<div className={styles.row}>
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
							className={styles.link}
						>
							Зарегистрироваться
						</Link>
					</p>
				</form>
			</AuthCard>
		</AuthPageLayout>
	)
}
