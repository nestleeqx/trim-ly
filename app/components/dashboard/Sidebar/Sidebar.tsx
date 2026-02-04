'use client'

import classNames from 'classnames'
import {
	BarChart3,
	LayoutDashboard,
	Link as LinkIcon,
	Menu,
	QrCode,
	Settings,
	X,
	Zap
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Logo from '../../ui/Logo/Logo'
import styles from './Sidebar.module.scss'

const navItems = [
	{
		href: '/dashboard',
		label: 'Дашборд',
		icon: <LayoutDashboard size={20} />
	},
	{ href: '/dashboard/links', label: 'Ссылки', icon: <LinkIcon size={20} /> },
	{
		href: '/dashboard/analytics',
		label: 'Аналитика',
		icon: <BarChart3 size={20} />
	},
	{ href: '/dashboard/qr', label: 'QR коды', icon: <QrCode size={20} /> },
	{
		href: '/dashboard/settings',
		label: 'Настройки',
		icon: <Settings size={20} />
	}
]

const Sidebar: React.FC = () => {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)

	const isActive = (href: string) => {
		if (href === '/dashboard') {
			return pathname === '/dashboard'
		}
		return pathname.startsWith(href)
	}

	const usedLinks = 6500
	const maxLinks = 10000
	const usagePercent = (usedLinks / maxLinks) * 100

	const toggleSidebar = () => setIsOpen(!isOpen)
	const closeSidebar = () => setIsOpen(false)

	return (
		<>
			<div
				className={classNames(styles.overlay, {
					[styles.visible]: isOpen
				})}
				onClick={closeSidebar}
			/>
			<aside
				className={classNames(styles.sidebar, {
					[styles.open]: isOpen
				})}
			>
				<div className={styles.top}>
					<div className={styles.logoWrapper}>
						<Logo />
						<button
							className={styles.closeBtn}
							onClick={closeSidebar}
						>
							<X size={20} />
						</button>
					</div>
					<nav className={styles.nav}>
						{navItems.map(item => (
							<Link
								key={item.href}
								href={item.href}
								className={classNames(styles.navItem, {
									[styles.active]: isActive(item.href)
								})}
								onClick={closeSidebar}
							>
								<span className={styles.navIcon}>
									{item.icon}
								</span>
								<span className={styles.navLabel}>
									{item.label}
								</span>
							</Link>
						))}
					</nav>
				</div>
				<div className={styles.bottom}>
					<div className={styles.storage}>
						<span className={styles.storageLabel}>ХРАНИЛИЩЕ</span>
						<div className={styles.progressBar}>
							<div
								className={styles.progressFill}
								style={{ width: `${usagePercent}%` }}
							/>
						</div>
						<span className={styles.storageText}>
							{(usedLinks / 1000).toFixed(1)}k из{' '}
							{maxLinks / 1000}k ссылок
						</span>
					</div>

					<button className={styles.upgradeBtn}>
						<Zap size={18} />
						<span>Перейти на Pro</span>
					</button>

					<span className={styles.planText}>Бесплатный план</span>
				</div>
			</aside>
			<button
				className={classNames(styles.mobileToggle, {
					[styles.hidden]: isOpen
				})}
				onClick={toggleSidebar}
				aria-label='Открыть меню'
			>
				<Menu size={24} />
			</button>
		</>
	)
}

export default Sidebar
