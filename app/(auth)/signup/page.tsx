'use client'

import styles from '@/app/(auth)/signup/page.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthDivider from '@/app/features/auth/components/AuthDivider/AuthDivider'
import AuthErrorBanner from '@/app/features/auth/components/AuthErrorBanner/AuthErrorBanner'
import FormField from '@/app/features/auth/components/FormContent/FormField'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import SocialAuthButtons from '@/app/features/auth/components/SocialAuthButtons/SocialAuthButtons'
import { useSignup } from '@/app/features/auth/hooks/useSignup'
import {
	hasErrors,
	validateSignup,
	type SignupFormErrors
} from '@/app/features/auth/validation/signupValidation'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function SignupPage() {
	const router = useRouter()
	const params = useSearchParams()
	const callbackUrl = params.get('callbackUrl') || '/dashboard'

	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [agreeTerms, setAgreeTerms] = useState(false)

	const [fieldErrors, setFieldErrors] = useState<SignupFormErrors>({})

	const { submit, isLoading, error, setError } = useSignup()

	const clearFieldError = useCallback((field: keyof SignupFormErrors) => {
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

			const form = e.currentTarget
			const fd = new FormData(form)

			const fullNameFromForm = String(fd.get('fullName') ?? '')
			const emailFromForm = String(fd.get('email') ?? '')
			const passwordFromForm = String(fd.get('password') ?? '')

			const validation = validateSignup({
				fullName: fullNameFromForm,
				email: emailFromForm,
				password: passwordFromForm,
				agreeTerms
			})

			setFieldErrors(validation)
			if (hasErrors(validation)) return

			setFullName(fullNameFromForm)
			setEmail(emailFromForm)
			setPassword(passwordFromForm)

			const result = await submit({
				email: emailFromForm.trim().toLowerCase(),
				password: passwordFromForm,
				name: fullNameFromForm.trim() || undefined
			})

			if (result.ok) router.push(callbackUrl)
		},
		[agreeTerms, submit, router, setError, callbackUrl]
	)

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
						onChange={e => {
							setFullName(e.target.value)
							clearFieldError('fullName')
						}}
						autoComplete='name'
						error={fieldErrors.fullName}
					/>

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
						error={fieldErrors.email}
					/>

					<PasswordInput
						id='password'
						label='Пароль'
						placeholder='Создайте надёжный пароль'
						value={password}
						onChange={e => {
							setPassword(e.target.value)
							clearFieldError('password')
						}}
						autoComplete='new-password'
						error={fieldErrors.password}
					/>

					<div className={styles.row}>
						<input
							id='terms'
							type='checkbox'
							className={styles.checkbox}
							checked={agreeTerms}
							disabled={isLoading}
							onChange={e => {
								setAgreeTerms(e.target.checked)
								clearFieldError('agreeTerms')
							}}
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

					{fieldErrors.agreeTerms && (
						<p className={styles.errorText}>
							{fieldErrors.agreeTerms}
						</p>
					)}
					<AuthErrorBanner className={styles.errorText} />
					{error && <p className={styles.errorText}>{error}</p>}
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						{isLoading ? 'Создаём…' : 'Создать аккаунт'}
					</Button>

					<AuthDivider text='Или присоединиться через' />
					<SocialAuthButtons />

					<p className={styles.footerText}>
						Уже есть аккаунт?{' '}
						<Link
							href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
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
