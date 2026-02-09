'use client'

import classNames from 'classnames'
import { Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'
import Button from '../../ui/Button'
import Logo from '../../ui/Logo'
import MobileNav from '../MobileNav'
import styles from './Header.module.scss'

const Header: React.FC = () => {
	const { theme, toggleTheme } = useTheme()
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
							{theme === 'light' ? (
								<Moon size={20} />
							) : (
								<Sun size={20} />
							)}
						</button>

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

						<MobileNav navItems={navItems} />
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
