import { useClickOutside } from '@/hooks/useClickOutside'
import { Bell } from 'lucide-react'
import { useCallback, useState } from 'react'
import styles from './NotificationBell.module.scss'

export default function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useClickOutside(useCallback(() => setIsOpen(false), []))

	return (
		<div
			className={styles.wrapper}
			ref={dropdownRef}
		>
			<button
				className={styles.bellBtn}
				onClick={() => setIsOpen(!isOpen)}
				aria-label='Уведомления'
				aria-expanded={isOpen}
			>
				<Bell size={20} />
			</button>

			{isOpen && (
				<>
					<div
						className={styles.overlay}
						onClick={() => setIsOpen(false)}
					/>
					<div className={styles.dropdown}>
						<p className={styles.empty}>Уведомлений нет</p>
					</div>
				</>
			)}
		</div>
	)
}
