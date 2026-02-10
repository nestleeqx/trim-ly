'use client'

import Button from '@/app/components/ui/Button/Button'
import Logo from '@/app/components/ui/Logo/Logo'
import styles from '@/app/not-found.module.scss'
import { CreditCard, Home, Search, Zap } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className={styles.page}>
			<div className={styles.logo}>
				<Logo />
			</div>

			<div className={styles.illustration}>
				<div className={styles.dot + ' ' + styles.dot1} />
				<div className={styles.dot + ' ' + styles.dot2} />
				<div className={styles.dot + ' ' + styles.dot3} />

				<div className={styles.digits}>
					<span className={`${styles.digit} ${styles.digitAnimated}`}>
						4
					</span>

					<div className={styles.centerOrb}>
						<Search
							size={32}
							className={styles.searchIcon}
						/>
					</div>

					<span className={`${styles.digit} ${styles.digitAnimated}`}>
						4
					</span>
				</div>
			</div>

			<div className={styles.textContent}>
				<h1 className={styles.title}>404 — Страница не найдена</h1>
				<p className={styles.subtitle}>
					Похоже, эта страница не существует или была перемещена. Мы
					поможем вам вернуться на правильный путь.
				</p>
			</div>

			<div className={styles.actions}>
				<Link
					href='/dashboard'
					className={styles.actionBtn}
				>
					<Button
						variant='primary'
						size='lg'
					>
						<Home size={16} />
						Перейти в дашборд
					</Button>
				</Link>
				<Link
					href='/pricing'
					className={styles.actionBtn}
				>
					<Button
						variant='outline'
						size='lg'
					>
						<CreditCard size={16} />
						Посмотреть тарифы
					</Button>
				</Link>
				<Link
					href='/links/new'
					className={styles.actionBtn}
				>
					<Button
						variant='outline'
						size='lg'
					>
						<Zap size={16} />
						Создать ссылку
					</Button>
				</Link>
			</div>
		</div>
	)
}
