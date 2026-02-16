'use client'

import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NavItem, navItems } from '../navigation.config'
import styles from '../Sidebar.module.scss'

interface SidebarNavProps {
	onItemClick?: () => void
}

const isActiveLink = (pathname: string, item: NavItem): boolean => {
	if (item.exact) {
		return pathname === item.href
	}
	return pathname.startsWith(item.href)
}

export default function SidebarNav({ onItemClick }: SidebarNavProps) {
	const pathname = usePathname()

	return (
		<nav className={styles.nav}>
			{navItems.map(item => {
				const Icon = item.icon
				const isActive = isActiveLink(pathname, item)

				return (
					<Link
						key={item.href}
						href={item.href}
						className={classNames(styles.navItem, {
							[styles.active]: isActive
						})}
						onClick={onItemClick}
					>
						<span className={styles.navIcon}>
							<Icon size={20} />
						</span>
						<span className={styles.navLabel}>{item.label}</span>
					</Link>
				)
			})}
		</nav>
	)
}
