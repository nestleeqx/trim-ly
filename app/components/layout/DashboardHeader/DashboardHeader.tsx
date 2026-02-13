'use client'

import MobileSearchOverlay from '@/app/components/layout/DashboardHeader/MobileSearchOverlay/MobileSearchOverlay'
import NotificationBell from '@/app/components/layout/DashboardHeader/NotificationBell/NotificationBell'
import Search from '@/app/components/layout/DashboardHeader/Search/Search'
import UserMenu from '@/app/components/layout/DashboardHeader/UserMenu/UserMenu'
import Button from '@/app/components/ui/Button/Button'
import { ArrowLeft, Plus, Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './DashboardHeader.module.scss'
import { SearchConfig } from './types'

const BREAKPOINT_MD = 768

interface DashboardHeaderProps {
	title: string
	subtitle?: string
	search?: SearchConfig
	actions?: React.ReactNode
	backHref?: string
	showCreateButton?: boolean
}

export default function DashboardHeader({
	title,
	subtitle,
	search,
	actions,
	backHref,
	showCreateButton = true
}: DashboardHeaderProps) {
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > BREAKPOINT_MD) setIsMobileSearchOpen(false)
		}

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		if (!isMobileSearchOpen) return
		const prevOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = prevOverflow
		}
	}, [isMobileSearchOpen])

	return (
		<>
			<header className={styles.header}>
				<div className={styles.titleSection}>
					{backHref && (
						<Link
							href={backHref}
							className={styles.backButton}
						>
							<ArrowLeft size={20} />
						</Link>
					)}
					<div>
						<h1 className={styles.title}>{title}</h1>
						{subtitle && (
							<p className={styles.subtitle}>{subtitle}</p>
						)}
					</div>
				</div>
				<div className={styles.actions}>
					{search && (
						<div className={styles.searchDesktop}>
							<Search
								value={search.value}
								onChange={search.onChange}
								onSearch={search.onSearch}
								placeholder={search.placeholder}
								autoSubmit={search.autoSubmit}
								debounceMs={search.debounceMs}
							/>
						</div>
					)}
					{search && (
						<button
							type='button'
							className={styles.searchMobileBtn}
							onClick={() => setIsMobileSearchOpen(true)}
							aria-label='Открыть поиск'
						>
							<SearchIcon size={18} />
						</button>
					)}
					{actions}
					{showCreateButton && (
						<Link
							href='/links/new'
							className={styles.createBtn}
						>
							<Button
								variant='primary'
								size='sm'
							>
								<Plus size={18} />
								<span>Создать ссылку</span>
							</Button>
						</Link>
					)}
					<NotificationBell />
					<UserMenu />
				</div>
			</header>
			{search && isMobileSearchOpen && (
				<MobileSearchOverlay
					search={search}
					onClose={() => setIsMobileSearchOpen(false)}
				/>
			)}
		</>
	)
}
