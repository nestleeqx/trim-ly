'use client'

import classNames from 'classnames'
import { Menu, X } from 'lucide-react'
import { useSidebar } from '../../../../hooks/useSidebar'
import Logo from '../../ui/Logo/Logo'
import styles from './Sidebar.module.scss'
import { SidebarNav } from './SidebarNav'
import { StorageUsage } from './StorageUsage'
import { UpgradeBanner } from './UpgradeBanner'

interface SidebarProps {
	usedLinks?: number
	maxLinks?: number
	planName?: string
}

const Sidebar: React.FC<SidebarProps> = ({
	usedLinks = 6500,
	maxLinks = 10000,
	planName = 'Бесплатный план'
}) => {
	const { isOpen, close, toggle } = useSidebar()

	return (
		<>
			<div
				className={classNames(styles.overlay, {
					[styles.visible]: isOpen
				})}
				onClick={close}
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
							onClick={close}
						>
							<X size={20} />
						</button>
					</div>
					<SidebarNav onItemClick={close} />
				</div>

				<div className={styles.bottom}>
					<StorageUsage
						used={usedLinks}
						max={maxLinks}
					/>
					<UpgradeBanner planName={planName} />
				</div>
			</aside>

			<button
				className={classNames(styles.mobileToggle, {
					[styles.hidden]: isOpen
				})}
				onClick={toggle}
				aria-label='Открыть меню'
			>
				<Menu size={24} />
			</button>
		</>
	)
}

export default Sidebar
