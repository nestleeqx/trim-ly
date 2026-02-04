'use client'

import { ChevronDown } from 'lucide-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './FilterDropdown.module.scss'

interface FilterDropdownProps {
	label: string
	icon?: ReactNode
	badgeCount?: number
	children: ReactNode
	hasSelection?: boolean
	className?: string
	onClose?: () => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
	label,
	icon,
	badgeCount,
	children,
	hasSelection = false,
	className = '',
	onClose
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
				onClose?.()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onClose])

	const getButtonClass = () => {
		let btnClass = styles.filterBtn
		if (isOpen) btnClass += ` ${styles.open}`
		if (hasSelection) btnClass += ` ${styles.hasSelection}`
		if (className) btnClass += ` ${className}`
		return btnClass
	}

	return (
		<div
			className={styles.filterWrapper}
			ref={dropdownRef}
		>
			<button
				className={getButtonClass()}
				onClick={() => setIsOpen(!isOpen)}
			>
				{icon}
				{label}
				{badgeCount !== undefined && badgeCount > 0 && (
					<span className={styles.badge}>{badgeCount}</span>
				)}
				<ChevronDown size={14} />
			</button>

			{isOpen && <div className={styles.dropdown}>{children}</div>}
		</div>
	)
}

export default FilterDropdown
