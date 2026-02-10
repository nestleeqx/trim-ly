'use client'

import styles from '@/app/(auth)/signup/page.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthDivider from '@/app/features/auth/components/AuthDivider/AuthDivider'
import FormField from '@/app/features/auth/components/FormContent/FormField'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import SocialAuthButtons from '@/app/features/auth/components/SocialAuthButtons/SocialAuthButtons'
import Link from 'next/link'
import { useCallback, useState } from 'react'

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
					<div className={styles.row}>
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
								className={styles.link}
							>
								Условиями использования
							</Link>{' '}
							и{' '}
							<Link
								href='/privacy'
								className={styles.link}
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
							className={styles.link}
						>
							Войти
						</Link>
					</p>
				</form>
			</AuthCard>
		</AuthPageLayout>
	)
}
