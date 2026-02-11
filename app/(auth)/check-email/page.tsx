'use client'

import styles from '@/app/(auth)/check-email/page.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import { Mail } from 'lucide-react'
import Link from 'next/link'

export default function CheckEmailPage() {
	return (
		<AuthPageLayout isBackButton={false}>
			<AuthCard
				title='Проверьте почту'
				subtitle='Если email существует, мы отправили ссылку для сброса пароля.'
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
					<p className={styles.footerText}>
						Вспомнили пароль?{' '}
						<Link
							href='/login'
							className={styles.link}
						>
							Вернуться ко входу
						</Link>
					</p>
				</div>
			</AuthCard>
		</AuthPageLayout>
	)
}
