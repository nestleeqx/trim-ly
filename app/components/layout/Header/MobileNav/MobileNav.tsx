'use client'

import Button from '@/app/components/ui/Button/Button'
import Logo from '@/app/components/ui/Logo/Logo'
import classNames from 'classnames'
import { Menu, Moon, Sun, X } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import styles from './MobileNav.module.scss'

interface NavItem {
	label: string
	href: string
}

interface MobileNavProps {
	navItems: NavItem[]
}

export default function MobileNav({ navItems }: MobileNavProps) {
	const { theme, toggleTheme } = useTheme()
	const { status } = useSession()
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
			document.body.style.touchAction = 'none'
		} else {
			document.body.style.overflow = ''
			document.body.style.touchAction = ''
		}

		return () => {
			document.body.style.overflow = ''
			document.body.style.touchAction = ''
		}
	}, [isOpen])

	const handleClose = () => {
		setIsOpen(false)
	}

	const handleNavClick = () => {
		setIsOpen(false)
	}

	return (
		<div className={styles.mobileNav}>
			<button
				className={styles.burger}
				onClick={() => setIsOpen(!isOpen)}
				aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
				aria-expanded={isOpen}
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			<div
				className={classNames(styles.overlay, {
					[styles.open]: isOpen
				})}
				onClick={handleClose}
			/>

			<nav
				className={classNames(styles.menu, { [styles.open]: isOpen })}
				aria-hidden={!isOpen}
			>
				<div className={styles.menuHeader}>
					<Logo />
					<button
						className={styles.closeBtn}
						onClick={handleClose}
						aria-label='Закрыть меню'
					>
						<X size={24} />
					</button>
				</div>

				<div className={styles.menuContent}>
					<ul className={styles.navList}>
						{navItems.map(item => (
							<li key={item.label}>
								<a
									href={item.href}
									className={styles.navLink}
									onClick={handleNavClick}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>

					<div className={styles.menuActions}>
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
							<span>
								{theme === 'light'
									? 'Темная тема'
									: 'Светлая тема'}
							</span>
						</button>

						{status !== 'authenticated' && <Link
							href='/login'
							onClick={handleNavClick}
						>
							<Button
								variant='ghost'
								size='lg'
								className={styles.fullWidth}
							>
								Войти
							</Button>
						</Link>}

						{status !== 'authenticated' && <Link
							href='/signup'
							onClick={handleNavClick}
						>
							<Button
								variant='primary'
								size='lg'
								className={styles.fullWidth}
							>
								Начать бесплатно
							</Button>
						</Link>}
					</div>
				</div>
			</nav>
		</div>
	)
}
