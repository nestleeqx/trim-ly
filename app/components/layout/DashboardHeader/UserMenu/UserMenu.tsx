import { useClickOutside } from '@/hooks/useClickOutside'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import styles from './UserMenu.module.scss'

export default function UserMenu() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useClickOutside(
		useCallback(() => setIsDropdownOpen(false), [])
	)

	return (
		<div
			className={styles.userWrapper}
			ref={dropdownRef}
		>
			<button
				className={styles.userBtn}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
							href='/profile'
							className={styles.dropdownItem}
							onClick={() => setIsDropdownOpen(false)}
						>
							<User size={16} />
							<span>Профиль</span>
						</Link>
						<Link
							href='/settings'
							className={styles.dropdownItem}
							onClick={() => setIsDropdownOpen(false)}
						>
							<Settings size={16} />
							<span>Настройки</span>
						</Link>
						<div className={styles.dropdownDivider} />
						<button
							className={styles.dropdownItem}
							onClick={() => setIsDropdownOpen(false)}
						>
							<LogOut size={16} />
							<span>Выйти</span>
						</button>
					</div>
				</>
			)}
		</div>
	)
}
