'use client'

import Logo from '@/app/components/ui/Logo/Logo'
import { useTheme } from '@/context/ThemeContext'
import classNames from 'classnames'
import { Moon, Sun } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import MobileNav from './components/MobileNav/MobileNav'
import DesktopHeaderActions from './components/DesktopHeaderActions/DesktopHeaderActions'
import { headerNavItems } from './header.config'
import styles from './Header.module.scss'

export default function Header() {
	const { resolvedTheme, toggleTheme } = useTheme()
	const { status } = useSession()
	const [scrolled, setScrolled] = useState(false)
	const isAuthenticated = status === 'authenticated'

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10)
		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

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
						{headerNavItems.map(item => (
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
							{resolvedTheme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
						</button>

						<DesktopHeaderActions isAuthenticated={isAuthenticated} />
						<MobileNav navItems={headerNavItems} />
					</div>
				</div>
			</div>
		</header>
	)
}
