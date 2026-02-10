'use client'

import styles from '@/app/(auth)/check-email/page.module.scss'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import AuthLogo from '@/app/features/auth/components/AuthLogo/AuthLogo'
import BackToHomeLink from '@/app/features/auth/components/BackToHomeLink/BackToHomeLink'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function CheckEmailPage() {
	return (
		<div className={styles.page}>
			<AuthLogo />
			<AuthCard
				title='Проверьте почту'
				subtitle='Мы отправили ссылку для сброса пароля на ваш email. Перейдите по ней, чтобы создать новый пароль.'
			>
				<div className={styles.iconWrapper}>
					<Mail size={32} />
				</div>
				<div className={styles.actions}>
					<Link
						href='/login'
						className={styles.submitBtn}
					>
						<Button
							variant='primary'
							size='lg'
						>
							Вернуться ко входу
						</Button>
					</Link>

					<p className={styles.footerText}>
						Не получили письмо?{' '}
						<Link
							href='/forgot-password'
							className={styles.link}
						>
							Отправить повторно
						</Link>
					</p>
				</div>
			</AuthCard>
			<BackToHomeLink />
		</div>
	)
}
