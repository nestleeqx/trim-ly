'use client'

import { ArrowLeft, Bell, Plus, Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Button from '../../ui/Button'
import { Search } from '../../ui/Search/Search'
import styles from './DashboardHeader.module.scss'
import MobileSearchOverlay from './MobileSearchOverlay/MobileSearchOverlay'
import UserMenu from './UserMenu/UserMenu'

interface SearchConfig {
	value: string
	onChange: (value: string) => void
	onSearch: (value: string) => void
	placeholder?: string
	autoSubmit?: boolean
}

interface DashboardHeaderProps {
	title: string
	subtitle?: string
	search?: SearchConfig
	actions?: React.ReactNode
	backHref?: string
	showCreateButton?: boolean
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	title,
	subtitle,
	search,
	actions,
	backHref,
	showCreateButton = true
}) => {
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) setIsMobileSearchOpen(false)
		}

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

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
							/>
						</div>
					)}
					{search && (
						<button
							className={styles.iconBtn}
							onClick={() => setIsMobileSearchOpen(true)}
							aria-label='Открыть поиск'
						>
							<SearchIcon size={20} />
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
					<button
						className={styles.iconBtn}
						aria-label='Уведомления'
					>
						<Bell size={20} />
					</button>
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

export default DashboardHeader
