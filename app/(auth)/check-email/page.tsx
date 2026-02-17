'use client'

import styles from '@/app/(auth)/check-email/page.module.scss'
import AuthPageLayout from '@/app/components/layout/AuthPageLayout/AuthPageLayout'
import Button from '@/app/components/ui/Button/Button'
import AuthCard from '@/app/features/auth/components/AuthCard/AuthCard'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckEmailPage() {
	const router = useRouter()

	return (
		<AuthPageLayout isBackButton={false}>
			<AuthCard
				title='Проверьте почту'
				subtitle='Если email существует, мы отправили ссылку для сброса пароля.'
			>
				<div className={styles.iconWrapper}>
					<Mail size={46} />
				</div>
				<div className={styles.actions}>
					<Button
						variant='primary'
						size='lg'
						className={styles.submitBtn}
						onClick={() => router.push('/login')}
					>
						Вернуться ко входу
					</Button>

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
