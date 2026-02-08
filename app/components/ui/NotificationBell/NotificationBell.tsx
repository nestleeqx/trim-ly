import { Bell } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useClickOutside } from '../../../../hooks/useClickOutside'
import styles from './NotificationBell.module.scss'

const NotificationBell: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useClickOutside(
		useCallback(() => setIsOpen(false), [])
	)

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

export default NotificationBell
