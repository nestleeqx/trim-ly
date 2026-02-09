'use client'

import Button from '@/app/components/ui/Button'
import { ArrowLeft, Link as LinkIcon, Mail } from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.scss'

export default function CheckEmailPage() {
	return (
		<div className={styles.page}>
			<div className={styles.logo}>
				<div className={styles.logoIcon}>
					<LinkIcon size={24} />
				</div>
				<span className={styles.logoText}>trim.ly</span>
			</div>

			<div className={styles.card}>
				<div className={styles.iconWrapper}>
					<Mail size={32} />
				</div>

				<div className={styles.cardHeader}>
					<h1 className={styles.cardTitle}>Проверьте почту</h1>
					<p className={styles.cardSubtitle}>
						Мы отправили ссылку для сброса пароля на ваш email.
						Перейдите по ней, чтобы создать новый пароль.
					</p>
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
							className={styles.resendLink}
						>
							Отправить повторно
						</Link>
					</p>
				</div>
			</div>

			<Link
				href='/'
				className={styles.backLink}
			>
				<ArrowLeft size={16} />
				Вернуться на главную
			</Link>
		</div>
	)
}
