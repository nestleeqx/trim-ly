'use client'

import Logo from '@/app/components/ui/Logo/Logo'
import cn from 'classnames'
import { Menu, X } from 'lucide-react'
import { useEffect } from 'react'
import styles from '../Sidebar.module.scss'
import SidebarNav from './SidebarNav'
import StorageUsage from './StorageUsage'
import UpgradeBanner from './UpgradeBanner'

interface SidebarShellProps {
	isOpen: boolean
	onClose: () => void
	onToggle: () => void
	usedLinks: number
	maxLinks: number
	planName: string
	isLimitReached: boolean
}

export default function SidebarShell({
	isOpen,
	onClose,
	onToggle,
	usedLinks,
	maxLinks,
	planName,
	isLimitReached
}: SidebarShellProps) {
	useEffect(() => {
		if (!isOpen) return

		const body = document.body
		const html = document.documentElement

		const prevBodyOverflow = body.style.overflow
		const prevHtmlOverflow = html.style.overflow
		const prevHtmlOverscroll = html.style.overscrollBehavior

		body.style.overflow = 'hidden'
		html.style.overflow = 'hidden'
		html.style.overscrollBehavior = 'none'

		return () => {
			body.style.overflow = prevBodyOverflow
			html.style.overflow = prevHtmlOverflow
			html.style.overscrollBehavior = prevHtmlOverscroll
		}
	}, [isOpen])

	return (
		<>
			<div
				className={cn(styles.overlay, { [styles.visible]: isOpen })}
				onClick={onClose}
			/>

			<aside className={cn(styles.sidebar, { [styles.open]: isOpen })}>
				<div className={styles.top}>
					<div className={styles.logoWrapper}>
						<Logo />
						<button
							className={styles.closeBtn}
							onClick={onClose}
						>
							<X size={20} />
						</button>
					</div>
					<SidebarNav onItemClick={onClose} />
				</div>

				<div className={styles.bottom}>
					<StorageUsage
						used={usedLinks}
						max={maxLinks}
						isLimitReached={isLimitReached}
					/>
					<UpgradeBanner
						planName={planName}
						isLimitReached={isLimitReached}
					/>
				</div>
			</aside>

			<button
				className={cn(styles.mobileToggle, { [styles.hidden]: isOpen })}
				onClick={onToggle}
				aria-label='Открыть меню'
			>
				<Menu size={24} />
			</button>
		</>
	)
}
