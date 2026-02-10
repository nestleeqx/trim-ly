'use client'

import styles from '@/app/(auth)/AuthShared.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import PasswordInput from '@/app/features/auth/components/FormContent/PasswordInput'
import Link from 'next/link'
import { useCallback, useState } from 'react'

export default function ResetPasswordPage() {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

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
					<PasswordInput
						id='password'
						label='Новый пароль'
						placeholder='Создайте надёжный пароль'
						value={password}
						onChange={e => setPassword(e.target.value)}
						autoComplete='new-password'
					/>
					<PasswordInput
						id='confirmPassword'
						label='Подтвердите пароль'
						placeholder='Повторите пароль'
						value={confirmPassword}
						onChange={e => setConfirmPassword(e.target.value)}
						autoComplete='new-password'
					/>
					<Button
						variant='primary'
						size='lg'
						type='submit'
					>
						Сохранить пароль
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
