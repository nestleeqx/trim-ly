'use client'

import styles from '@/app/(auth)/AuthShared.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthErrorBanner from '@/app/features/auth/components/AuthErrorBanner/AuthErrorBanner'
import FormField from '@/app/features/auth/components/FormContent/FormField'
import { useForgotPassword } from '@/app/features/auth/hooks/useForgotPassword'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export default function ForgotPasswordPage() {
	const router = useRouter()

	const [email, setEmail] = useState('')
	const [demoResetUrl, setDemoResetUrl] = useState<string | null>(null)

	const { submit, isLoading, error } = useForgotPassword()

	const handleSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			setDemoResetUrl(null)

			const fd = new FormData(e.currentTarget)
			const emailFromForm = String(fd.get('email') ?? '')

			const result = await submit(emailFromForm)

			if (result.ok) {
				if (result.demoResetUrl) {
					setDemoResetUrl(result.demoResetUrl)
					return
				}

				const normalizedEmail = emailFromForm.trim().toLowerCase()
				router.push(
					`/check-email?flow=forgot&email=${encodeURIComponent(normalizedEmail)}`
				)
			}
		},
		[submit, router]
	)

	return (
		<AuthPageLayout isBackButton={false}>
			<AuthCard
				title='Сбросить пароль'
				subtitle='Введите email и мы отправим вам ссылку для сброса.'
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
						disabled={isLoading}
					/>
					<AuthErrorBanner className={styles.errorText} />
					{error && <p className={styles.errorText}>{error}</p>}
					{demoResetUrl && (
						<p className={styles.footerText}>
							Демо-режим: письмо не отправляется.{' '}
							<Link href={demoResetUrl} className={styles.link}>
								Открыть ссылку для сброса
							</Link>
						</p>
					)}
					<Button
						variant='primary'
						size='lg'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? 'Отправляем…' : 'Отправить ссылку'}
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
