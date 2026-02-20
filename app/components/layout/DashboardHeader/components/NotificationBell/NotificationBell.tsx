import { useClickOutside } from '@/hooks/useClickOutside'
import { Bell } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import styles from './NotificationBell.module.scss'

export default function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useClickOutside(useCallback(() => setIsOpen(false), []))

	useEffect(() => {
		if (!isOpen) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setIsOpen(false)
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [isOpen])

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
				aria-haspopup='menu'
			>
				<Bell size={20} />
			</button>

			{isOpen && (
				<>
					<div className={styles.dropdown}>
						<p className={styles.empty}>Уведомлений нет</p>
					</div>
				</>
			)}
		</div>
	)
}
