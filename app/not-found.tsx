'use client'

import { CreditCard, Home, Search, Zap } from 'lucide-react'
import Link from 'next/link'
import Button from './components/ui/Button'
import Logo from './components/ui/Logo'
import styles from './not-found.module.scss'

export default function NotFound() {
	return (
		<div className={styles.page}>
			<div className={styles.logo}>
				<Logo />
			</div>

			{/* Animated 404 Illustration */}
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

			{/* Text */}
			<div className={styles.textContent}>
				<h1 className={styles.title}>404 — Страница не найдена</h1>
				<p className={styles.subtitle}>
					Похоже, эта страница не существует или была перемещена. Мы
					поможем вам вернуться на правильный путь.
				</p>
			</div>

			{/* Actions */}
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
