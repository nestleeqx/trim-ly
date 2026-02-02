'use client'

import classNames from 'classnames'
import { Menu, Moon, Sun, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import Button from '../../ui/Button'
import Logo from '../../ui/Logo'
import styles from './MobileNav.module.scss'

interface NavItem {
	label: string
	href: string
}

interface MobileNavProps {
	navItems: NavItem[]
}

const MobileNav: React.FC<MobileNavProps> = ({ navItems }) => {
	const { theme, toggleTheme } = useTheme()
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		if (isOpen) {
			// Простая блокировка без padding-right (чтобы избежать сдвига)
			document.body.style.overflow = 'hidden'
			document.body.style.touchAction = 'none' // Запрет touch-событий на body
		} else {
			document.body.style.overflow = ''
			document.body.style.touchAction = ''
		}

		return () => {
			// Гарантированный сброс при размонтировании
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

						<Link
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
						</Link>

						<Link
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
						</Link>
					</div>
				</div>
			</nav>
		</div>
	)
}

export default MobileNav
