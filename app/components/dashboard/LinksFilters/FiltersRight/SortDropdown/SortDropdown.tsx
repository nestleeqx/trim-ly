'use client'

import { SortField, SortOrder, SortState } from '@/types/filterLinks'
import { ArrowUp, Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
	SORT_OPTIONS,
	SORT_ORDER_ICONS
} from '../../../dashboard/LinksFilters/helpers/sortConfig'
import styles from './SortDropdown.module.scss'

interface SortDropdownProps {
	sort: SortState
	onSortChange: (sort: SortState) => void
}

/**
 * SortDropdown
 * Компонент для выбора сортировки с двухуровневым меню
 */
const SortDropdown: React.FC<SortDropdownProps> = ({ sort, onSortChange }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [menuLevel, setMenuLevel] = useState<'main' | 'sub'>('main')
	const [selectedField, setSelectedField] = useState<SortField | null>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Закрытие дропдауна при клике снаружи
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
				setMenuLevel('main')
				setSelectedField(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const currentOption = SORT_OPTIONS.find(opt => opt.field === sort.field)
	const currentSubOption = currentOption?.subOptions.find(
		sub => sub.order === sort.order
	)

	const getCurrentLabel = () => {
		if (!currentOption || !currentSubOption) return 'Сортировка'
		return `${currentOption.label} (${currentSubOption.label})`
	}

	const handleSelectField = (field: SortField) => {
		setSelectedField(field)
		setMenuLevel('sub')
	}

	const handleSelectOrder = (field: SortField, order: SortOrder) => {
		onSortChange({ field, order })
		setIsOpen(false)
		setMenuLevel('main')
		setSelectedField(null)
	}

	const handleBackToMain = () => {
		setMenuLevel('main')
		setSelectedField(null)
	}

	return (
		<div className={styles.wrapper}>
			<span className={styles.sortLabel}>СОРТИРОВКА:</span>
			<div
				className={styles.container}
				ref={dropdownRef}
			>
				<button
					className={`${styles.filterBtn} ${isOpen ? styles.open : ''}`}
					onClick={() => {
						setIsOpen(!isOpen)
						setMenuLevel('main')
					}}
				>
					<ArrowUp size={14} />
					{getCurrentLabel()}
					<ChevronDown size={14} />
				</button>

				{isOpen && (
					<div
						className={`${styles.dropdown} ${styles.sortDropdown}`}
						data-level={menuLevel}
					>
						{menuLevel === 'main' ? (
							<>
								<div className={styles.dropdownHeader}>
									Сортировать по:
								</div>
								{SORT_OPTIONS.map(option => (
									<button
										key={option.field}
										className={`${styles.dropdownItem} ${styles.sortItem} ${sort.field === option.field ? styles.selected : ''}`}
										onClick={() =>
											handleSelectField(option.field)
										}
									>
										<div className={styles.sortItemContent}>
											{option.icon}
											<span>{option.label}</span>
										</div>
										{sort.field === option.field && (
											<div
												className={styles.sortIndicator}
											>
												{SORT_ORDER_ICONS[sort.order]}
												<span
													className={
														styles.currentSortLabel
													}
												>
													{currentSubOption?.label}
												</span>
											</div>
										)}
									</button>
								))}
							</>
						) : (
							<>
								<button
									className={`${styles.dropdownItem} ${styles.sortBack}`}
									onClick={handleBackToMain}
								>
									<ChevronDown
										size={12}
										className={styles.chevronLeft}
									/>
									Назад к выбору
								</button>
								<div className={styles.dropdownHeader}>
									{
										SORT_OPTIONS.find(
											opt => opt.field === selectedField
										)?.label
									}
								</div>
								{SORT_OPTIONS.find(
									opt => opt.field === selectedField
								)?.subOptions.map(subOption => (
									<button
										key={subOption.order}
										className={`${styles.dropdownItem} ${styles.sortSubItem} ${sort.field === selectedField && sort.order === subOption.order ? styles.selected : ''}`}
										onClick={() =>
											handleSelectOrder(
												selectedField!,
												subOption.order
											)
										}
									>
										<span>{subOption.label}</span>
										{sort.field === selectedField &&
											sort.order === subOption.order && (
												<Check size={12} />
											)}
									</button>
								))}
							</>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

export default SortDropdown
