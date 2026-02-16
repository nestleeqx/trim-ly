'use client'

import { useClickOutside } from '@/hooks/useClickOutside'
import cn from 'classnames'
import { ChevronDown } from 'lucide-react'
import { ReactNode, useCallback, useState } from 'react'
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

export default function FilterDropdown({
	label,
	icon,
	badgeCount,
	children,
	hasSelection = false,
	className = '',
	onClose
}: FilterDropdownProps) {
	const [isOpen, setIsOpen] = useState(false)

	const handleClose = useCallback(() => {
		setIsOpen(false)
		onClose?.()
	}, [onClose])

	const dropdownRef = useClickOutside(handleClose)

	return (
		<div
			className={styles.filterWrapper}
			ref={dropdownRef}
		>
			<button
				className={cn(styles.filterBtn, className, {
					[styles.open]: isOpen,
					[styles.hasSelection]: hasSelection
				})}
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
