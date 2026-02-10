'use client'

import styles from '@/app/(auth)/AuthShared.module.scss'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthLogo from '@/app/features/auth/components/AuthLogo/AuthLogo'
import BackToHomeLink from '@/app/features/auth/components/BackToHomeLink/BackToHomeLink'
import FormField from '@/app/features/auth/components/FormContent/FormField'
import Link from 'next/link'
import { useCallback, useState } from 'react'

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('')

	const handleSubmit = useCallback((e: React.FormEvent) => {
		e.preventDefault()
	}, [])

	return (
		<div className={styles.page}>
			<AuthLogo />
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
					/>
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
							className={styles.link}
						>
							Вернуться ко входу
						</Link>
					</p>
				</form>
			</AuthCard>
			<BackToHomeLink />
		</div>
	)
}
