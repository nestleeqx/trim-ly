import { useLogout } from '@/app/features/auth/hooks/useLogout'
import { useClickOutside } from '@/hooks/useClickOutside'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import styles from './UserMenu.module.scss'

export default function UserMenu() {
	const { data: session } = useSession()
	const { logout, isLoading } = useLogout()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useClickOutside(
		useCallback(() => setIsDropdownOpen(false), [])
	)

	const avatarUrl = session?.user?.image ?? ''
	const fallbackInitial = useMemo(() => {
		const source = session?.user?.name || session?.user?.email || 'U'
		return source.charAt(0).toUpperCase()
	}, [session?.user?.email, session?.user?.name])

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
				<div className={styles.avatar}>
					{avatarUrl ? (
						<Image
							src={avatarUrl}
							alt='User avatar'
							width={32}
							height={32}
							className={styles.avatarImage}
						/>
					) : (
						<span className={styles.avatarFallback}>
							{fallbackInitial}
						</span>
					)}
				</div>
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
						<div className={styles.dropdownDivider} />
						<button
							className={styles.dropdownItem}
							onClick={logout}
							disabled={isLoading}
						>
							<LogOut size={16} />
							<span>{isLoading ? 'Выходим…' : 'Выйти'}</span>
						</button>
					</div>
				</>
			)}
		</div>
	)
}
