'use client'

import styles from '@/app/(auth)/login/page.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import NoticeBanner from '@/app/components/ui/NoticeBanner/NoticeBanner'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthDivider from '@/app/features/auth/components/AuthDivider/AuthDivider'
import FormField from '@/app/features/auth/components/FormContent/FormField'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import SocialAuthButtons from '@/app/features/auth/components/SocialAuthButtons/SocialAuthButtons'
import { useLogin } from '@/app/features/auth/hooks/useLogin'
import {
	hasErrors,
	LoginErrors,
	validateLogin
} from '@/app/features/auth/validation/loginValidation'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const params = useSearchParams()
	const callbackUrl = params.get('callbackUrl') || '/dashboard'

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [fieldErrors, setFieldErrors] = useState<LoginErrors>({})
	const [remember, setRemember] = useState(true)

	const { submit, isLoading, error, setError } = useLogin()

	const clearFieldError = useCallback((field: keyof LoginErrors) => {
		setFieldErrors(prev => {
			if (!prev[field]) return prev
			const next = { ...prev }
			delete next[field]
			return next
		})
	}, [])

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			setError(null)

			// ВАЖНО: читаем из формы, чтобы autofill не ломал state
			const fd = new FormData(e.currentTarget)
			const emailFromForm = String(fd.get('email') ?? '')
			const passwordFromForm = String(fd.get('password') ?? '')
			const rememberFromForm = fd.get('remember') === 'on'

			const validation = validateLogin({
				email: emailFromForm,
				password: passwordFromForm
			})

			setFieldErrors(validation)
			if (hasErrors(validation)) return

			setEmail(emailFromForm)
			setPassword(passwordFromForm)

			const result = await submit({
				email: emailFromForm,
				password: passwordFromForm,
				remember: rememberFromForm
			})

			if (result.ok) router.push(callbackUrl)
		},
		[submit, router, callbackUrl, setError]
	)

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
						onChange={e => {
							setEmail(e.target.value)
							clearFieldError('email')
						}}
						autoComplete='email'
						disabled={isLoading}
						error={fieldErrors.email}
					/>
					<PasswordInput
						id='password'
						label='Пароль'
						placeholder='••••••••'
						value={password}
						onChange={e => {
							setPassword(e.target.value)
							clearFieldError('password')
						}}
						autoComplete='current-password'
						disabled={isLoading}
						showForgotLink={true}
						forgotLinkClassName={styles.forgotLink}
						error={fieldErrors.password}
					/>
					<div className={styles.row}>
						<input
							id='remember'
							name='remember'
							type='checkbox'
							className={styles.checkbox}
							checked={remember}
							disabled={isLoading}
							onChange={e => setRemember(e.target.checked)}
						/>
						<label
							htmlFor='remember'
							className={styles.rememberLabel}
						>
							Запомнить меня
						</label>
					</div>
					<NoticeBanner />
					{error && (
						<NoticeBanner
							type='error'
							message={error}
						/>
					)}
					<Button
						variant='primary'
						size='lg'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? 'Входим…' : 'Войти'}
					</Button>
					<AuthDivider text='Или продолжить с' />
					<SocialAuthButtons disabled={isLoading} />
					<p className={styles.footerText}>
						Нет аккаунта?{' '}
						<Link
							href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
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
