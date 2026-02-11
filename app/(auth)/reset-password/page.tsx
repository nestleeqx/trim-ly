'use client'

import styles from '@/app/(auth)/AuthShared.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import { useResetPassword } from '@/app/features/auth/hooks/useResetPassword'
import {
	hasErrors,
	ResetPasswordErrors,
	validateResetPassword
} from '@/app/features/auth/validation/resetPasswordValidation'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function ResetPasswordPage() {
	const router = useRouter()
	const params = useSearchParams()
	const token = useMemo(() => params.get('token') ?? '', [params])
	const [isCheckingToken, setIsCheckingToken] = useState(true)

	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [fieldErrors, setFieldErrors] = useState<ResetPasswordErrors>({})

	const { submit, isLoading, error, setError } = useResetPassword()

	useEffect(() => {
		let isMounted = true

		const verifyToken = async () => {
			if (!token) {
				router.replace('/forgot-password')
				return
			}

			try {
				const res = await fetch(
					`/api/auth/reset-password?token=${encodeURIComponent(token)}`,
					{ method: 'GET' }
				)

				if (!res.ok) {
					router.replace('/forgot-password?invalid=1')
					return
				}
			} catch {
				router.replace('/forgot-password?invalid=1')
				return
			} finally {
				if (isMounted) setIsCheckingToken(false)
			}
		}

		verifyToken()
		return () => {
			isMounted = false
		}
	}, [router, token])

	const clearFieldError = useCallback((field: keyof ResetPasswordErrors) => {
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

			if (!token) {
				setError('Неверная ссылка. Запросите сброс пароля ещё раз.')
				return
			}

			const fd = new FormData(e.currentTarget)
			const passwordFromForm = String(fd.get('password') ?? '')
			const confirmFromForm = String(fd.get('confirmPassword') ?? '')

			const validation = validateResetPassword({
				password: passwordFromForm,
				confirmPassword: confirmFromForm
			})

			setFieldErrors(validation)
			if (hasErrors(validation)) return

			setPassword(passwordFromForm)
			setConfirmPassword(confirmFromForm)

			const result = await submit(token, passwordFromForm)
			if (result.ok) router.push('/login?reset=1')
		},
		[token, submit, router, setError]
	)

	if (isCheckingToken) {
		return null
	}

	return (
		<AuthPageLayout isBackButton={false}>
			<AuthCard
				title='С возвращением'
				subtitle='Войдите, чтобы управлять ссылками и аналитикой.'
			>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<PasswordInput
						id='password'
						label='Новый пароль'
						placeholder='Создайте надёжный пароль'
						value={password}
						onChange={e => {
							setPassword(e.target.value)
							clearFieldError('password')
						}}
						autoComplete='new-password'
						error={fieldErrors.password}
					/>
					<PasswordInput
						id='confirmPassword'
						label='Подтвердите пароль'
						placeholder='Повторите пароль'
						value={confirmPassword}
						onChange={e => {
							setConfirmPassword(e.target.value)
							clearFieldError('confirmPassword')
						}}
						autoComplete='new-password'
						error={fieldErrors.confirmPassword}
					/>
					{error && <p className={styles.errorText}>{error}</p>}
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						{isLoading ? 'Сохраняем...' : 'Сохранить пароль'}
					</Button>
					<p className={styles.footerText}>
						Вспомнили пароль?{' '}
						<Link
							href='/login'
							className={styles.link}
						>
							Вернуться ко входу
						</Link>
					</p>
				</form>
			</AuthCard>
		</AuthPageLayout>
	)
}
