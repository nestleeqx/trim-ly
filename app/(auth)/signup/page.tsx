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

export default function SignupPage() {
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [agreeTerms, setAgreeTerms] = useState(false)

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<AuthPageLayout>
			<AuthCard
				title='Создайте аккаунт'
				subtitle='Начните сокращать ссылки за секунды.'
			>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<FormField
						id='fullName'
						label='Полное имя'
						type='text'
						placeholder='Alex Rivera'
						value={fullName}
						onChange={e => setFullName(e.target.value)}
						autoComplete='name'
					/>
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
						placeholder='Создайте надёжный пароль'
						value={password}
						onChange={e => setPassword(e.target.value)}
						autoComplete='new-password'
					/>
					<div className={styles.termsRow}>
						<input
							id='terms'
							type='checkbox'
							className={styles.checkbox}
							checked={agreeTerms}
							onChange={e => setAgreeTerms(e.target.checked)}
						/>
						<label
							htmlFor='terms'
							className={styles.termsLabel}
						>
							Я согласен с{' '}
							<Link
								href='/terms'
								className={styles.termsLink}
							>
								Условиями использования
							</Link>{' '}
							и{' '}
							<Link
								href='/privacy'
								className={styles.termsLink}
							>
								Политикой конфиденциальности
							</Link>
							.
						</label>
					</div>
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						Создать аккаунт
					</Button>
					<AuthDivider text='Или присоединиться через' />
					<SocialAuthButtons />
					<p className={styles.footerText}>
						Уже есть аккаунт?{' '}
						<Link
							href='/login'
							className={styles.loginLink}
						>
							Войти
						</Link>
					</p>
				</form>
			</AuthCard>
		</AuthPageLayout>
	)
}
