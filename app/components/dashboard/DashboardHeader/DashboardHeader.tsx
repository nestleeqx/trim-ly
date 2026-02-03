'use client'

import {
	Bell,
	ChevronDown,
	LogOut,
	Plus,
	Search,
	Settings,
	User,
	X
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './DashboardHeader.module.scss'

interface DashboardHeaderProps {
	title: string
	subtitle?: string
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	title,
	subtitle
}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const mobileSearchRef = useRef<HTMLInputElement>(null)

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

	const openSearch = () => {
		setIsSearchOpen(true)
		setTimeout(() => mobileSearchRef.current?.focus(), 100)
	}

	const closeSearch = () => {
		setIsSearchOpen(false)
		setSearchQuery('')
	}

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
	}

	const handleSearchKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && searchQuery.trim()) {
			console.log('Search:', searchQuery)
			closeSearch()
		}
		if (e.key === 'Escape') {
			closeSearch()
		}
	}

	const handleLogout = () => {
		console.log('Logout')
		setIsDropdownOpen(false)
	}

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setIsSearchOpen(false)
			}
		}

		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}

		window.addEventListener('resize', handleResize)
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			window.removeEventListener('resize', handleResize)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<>
			<header className={styles.header}>
				<div className={styles.titleSection}>
					<h1 className={styles.title}>{title}</h1>
					{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
				</div>

				<div className={styles.actions}>
					{/* Desktop search */}
					<div className={styles.searchWrapper}>
						<Search size={18} className={styles.searchIcon} />
						<input
							type='text'
							placeholder='Поиск...'
							value={searchQuery}
							onChange={handleSearchChange}
							onKeyDown={handleSearchKeyDown}
							className={styles.searchInput}
						/>
					</div>

					{/* Mobile search toggle */}
					<button
						className={styles.searchToggle}
						onClick={openSearch}
						aria-label='Открыть поиск'
					>
						<Search size={20} />
					</button>

					<Link href='/links/new' className={styles.createBtn}>
						<Plus size={18} />
						<span>Создать ссылку</span>
					</Link>

					<button className={styles.notificationBtn} aria-label='Уведомления'>
						<Bell size={20} />
					</button>

					<div className={styles.userWrapper} ref={dropdownRef}>
						<button
							className={styles.userBtn}
							onClick={toggleDropdown}
							aria-label='Меню пользователя'
							aria-expanded={isDropdownOpen}
						>
							<div className={styles.avatar} />
							<ChevronDown
								size={16}
								className={`${styles.chevron} ${isDropdownOpen ? styles.open : ''}`}
							/>
						</button>

						{isDropdownOpen && (
							<>
								<div
									className={styles.overlay}
									onClick={() => setIsDropdownOpen(false)}
								/>
								<div className={styles.dropdown}>
									<Link
										href='/dashboard/profile'
										className={styles.dropdownItem}
										onClick={() => setIsDropdownOpen(false)}
									>
										<User size={16} />
										<span>Профиль</span>
									</Link>
									<Link
										href='/dashboard/settings'
										className={styles.dropdownItem}
										onClick={() => setIsDropdownOpen(false)}
									>
										<Settings size={16} />
										<span>Настройки</span>
									</Link>
									<div className={styles.dropdownDivider} />
									<button
										className={styles.dropdownItem}
										onClick={handleLogout}
									>
										<LogOut size={16} />
										<span>Выйти</span>
									</button>
								</div>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Mobile search overlay */}
			<div
				className={`${styles.mobileSearch} ${isSearchOpen ? styles.open : ''}`}
			>
				<div className={styles.mobileSearchInner}>
					<input
						ref={mobileSearchRef}
						type='text'
						placeholder='Поиск...'
						value={searchQuery}
						onChange={handleSearchChange}
						onKeyDown={handleSearchKeyDown}
						className={styles.mobileSearchInput}
					/>
					<button
						className={styles.closeSearch}
						onClick={closeSearch}
						aria-label='Закрыть поиск'
					>
						<X size={20} />
					</button>
				</div>
			</div>
		</>
	)
}

export default DashboardHeader
