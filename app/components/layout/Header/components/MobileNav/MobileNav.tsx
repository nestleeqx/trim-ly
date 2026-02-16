'use client'

import Logo from '@/app/components/ui/Logo/Logo'
import { useTheme } from '@/context/ThemeContext'
import cn from 'classnames'
import { Menu, X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import type { HeaderNavItem } from '../../header.config'
import MobileNavActions from './MobileNavActions'
import styles from './MobileNav.module.scss'

interface MobileNavProps {
	navItems: HeaderNavItem[]
}

export default function MobileNav({ navItems }: MobileNavProps) {
	const { resolvedTheme, toggleTheme } = useTheme()
	const { status } = useSession()
	const [isOpen, setIsOpen] = useState(false)
	const isAuthenticated = status === 'authenticated'

	useEffect(() => {
		document.body.style.overflow = isOpen ? 'hidden' : ''
		document.body.style.touchAction = isOpen ? 'none' : ''
		return () => {
			document.body.style.overflow = ''
			document.body.style.touchAction = ''
		}
	}, [isOpen])

	const closeMenu = () => setIsOpen(false)
	const toggleMenu = () => setIsOpen(prev => !prev)

	return (
		<div className={styles.mobileNav}>
			<button
				className={styles.burger}
				onClick={toggleMenu}
				aria-label={
					isOpen
						? 'Закрыть меню'
						: 'Открыть меню'
				}
				aria-expanded={isOpen}
			>
				{isOpen ? <X size={24} /> : <Menu size={24} />}
			</button>

			<div
				className={cn(styles.overlay, { [styles.open]: isOpen })}
				onClick={closeMenu}
			/>

			<nav
				className={cn(styles.menu, { [styles.open]: isOpen })}
				aria-hidden={!isOpen}
			>
				<div className={styles.menuHeader}>
					<Logo />
					<button
						className={styles.closeBtn}
						onClick={closeMenu}
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
									onClick={closeMenu}
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>

					<MobileNavActions
						isAuthenticated={isAuthenticated}
						resolvedTheme={resolvedTheme}
						onToggleTheme={toggleTheme}
						onNavClick={closeMenu}
					/>
				</div>
			</nav>
		</div>
	)
}
