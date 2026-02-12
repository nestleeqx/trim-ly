'use client'

import Button from '@/app/components/ui/Button/Button'
import Logo from '@/app/components/ui/Logo/Logo'
import { useTheme } from '@/context/ThemeContext'
import classNames from 'classnames'
import { Moon, Sun } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import MobileNav from './MobileNav/MobileNav'

export default function Header() {
	const { resolvedTheme, toggleTheme } = useTheme()
	const { status } = useSession()
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const navItems = [
		{ label: 'Возможности', href: '#features' },
		{ label: 'Аналитика', href: '#analytics' },
		{ label: 'Тарифы', href: '#pricing' },
		{ label: 'FAQ', href: '#faq' }
	]

	return (
		<header
			className={classNames(styles.header, {
				[styles.scrolled]: scrolled
			})}
		>
			<div className='container'>
				<div className={styles.content}>
					<Logo />

					<nav className={styles.nav}>
						{navItems.map(item => (
							<a
								key={item.label}
								href={item.href}
								className={styles.navLink}
							>
								{item.label}
							</a>
						))}
					</nav>

					<div className={styles.actions}>
						<button
							className={styles.themeToggle}
							onClick={toggleTheme}
							aria-label='Переключить тему'
						>
							{resolvedTheme === 'light' ? (
								<Moon size={20} />
							) : (
								<Sun size={20} />
							)}
						</button>

						{status !== 'authenticated' ? (
							<>
								<Link
									href='/login'
									className={styles.desktopOnly}
								>
									<Button
										variant='ghost'
										size='sm'
									>
										Войти
									</Button>
								</Link>
								<Link
									href='/signup'
									className={styles.desktopOnly}
								>
									<Button
										variant='primary'
										size='sm'
									>
										Начать бесплатно
									</Button>
								</Link>
							</>
						) : (
							<Link
								href='/dashboard'
								className={styles.desktopOnly}
							>
								<Button
									variant='primary'
									size='sm'
								>
									Личный кабинет
								</Button>
							</Link>
						)}
						<MobileNav navItems={navItems} />
					</div>
				</div>
			</div>
		</header>
	)
}
