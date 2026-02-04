'use client'

import { SortField, SortOrder, SortState } from '@/types/filterLinks'
import {
	ArrowDown,
	ArrowDownUp,
	ArrowUp,
	BarChart,
	CalendarDays,
	Check,
	ChevronDown,
	Circle,
	Clock,
	Hash
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from './SortDropdown.module.scss'

interface SortDropdownProps {
	sort: SortState
	onSortChange: (sort: SortState) => void
}

const sortOptions: {
	field: SortField
	label: string
	icon: React.ReactNode
	subOptions: { order: SortOrder; label: string }[]
}[] = [
	{
		field: 'created_date',
		label: 'Дата создания',
		icon: <CalendarDays size={14} />,
		subOptions: [
			{ order: 'desc', label: 'Сначала новые' },
			{ order: 'asc', label: 'Сначала старые' }
		]
	},
	{
		field: 'clicks',
		label: 'Клики',
		icon: <BarChart size={14} />,
		subOptions: [
			{ order: 'desc', label: 'По убыванию' },
			{ order: 'asc', label: 'По возрастанию' }
		]
	},
	{
		field: 'title',
		label: 'Название',
		icon: <Hash size={14} />,
		subOptions: [
			{ order: 'asc', label: 'А-Я' },
			{ order: 'desc', label: 'Я-А' }
		]
	},
	{
		field: 'status',
		label: 'Статус',
		icon: <Circle size={14} />,
		subOptions: [
			{ order: 'asc', label: 'Активна → Удалена' },
			{ order: 'desc', label: 'Удалена → Активна' }
		]
	},
	{
		field: 'expiration_date',
		label: 'Дата истечения',
		icon: <Clock size={14} />,
		subOptions: [
			{ order: 'desc', label: 'Сначала новые' },
			{ order: 'asc', label: 'Сначала старые' }
		]
	}
]

const SortDropdown: React.FC<SortDropdownProps> = ({ sort, onSortChange }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [menuLevel, setMenuLevel] = useState<'main' | 'sub'>('main')
	const [hoveredSortField, setHoveredSortField] = useState<SortField | null>(
		null
	)
	const dropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false)
				setMenuLevel('main')
				setHoveredSortField(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const getCurrentSortLabel = () => {
		const option = sortOptions.find(opt => opt.field === sort.field)
		if (!option) return 'Сортировка'

		const subOption = option.subOptions.find(
			sub => sub.order === sort.order
		)
		return `${option.label} (${subOption?.label || ''})`
	}

	const getSortIcon = () => {
		if (sort.order === 'asc') return <ArrowUp size={14} />
		if (sort.order === 'desc') return <ArrowDown size={14} />
		return <ArrowDownUp size={14} />
	}

	const getButtonClass = () => {
		let className = styles.filterBtn
		if (isOpen) className += ` ${styles.open}`
		return className
	}

	const handleSortSelect = (field: SortField) => {
		setHoveredSortField(field)
		setMenuLevel('sub')
	}

	const handleSortOrderSelect = (field: SortField, order: SortOrder) => {
		onSortChange({ field, order })
		setIsOpen(false)
		setMenuLevel('main')
		setHoveredSortField(null)
	}

	const handleBackToMain = () => {
		setMenuLevel('main')
		setHoveredSortField(null)
	}

	return (
		<div className={styles.wrapper}>
			<span className={styles.sortLabel}>СОРТИРОВКА:</span>
			<div
				className={styles.container}
				ref={dropdownRef}
			>
				<button
					className={getButtonClass()}
					onClick={() => {
						setIsOpen(!isOpen)
						setMenuLevel('main')
					}}
				>
					<ArrowDownUp size={14} />
					{getCurrentSortLabel()}
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
								{sortOptions.map(option => (
									<button
										key={option.field}
										className={`${styles.dropdownItem} ${styles.sortItem} ${sort.field === option.field ? styles.selected : ''}`}
										onClick={() =>
											handleSortSelect(option.field)
										}
										onMouseEnter={() =>
											setHoveredSortField(option.field)
										}
									>
										<div className={styles.sortItemContent}>
											{option.icon}
											<span>{option.label}</span>
										</div>
										<div className={styles.sortIndicator}>
											{sort.field === option.field && (
												<>
													{getSortIcon()}
													<span
														className={
															styles.currentSortLabel
														}
													>
														{
															option.subOptions.find(
																sub =>
																	sub.order ===
																	sort.order
															)?.label
														}
													</span>
												</>
											)}
										</div>
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
										sortOptions.find(
											opt =>
												opt.field === hoveredSortField
										)?.label
									}
								</div>
								{sortOptions
									.find(opt => opt.field === hoveredSortField)
									?.subOptions.map(subOption => (
										<button
											key={subOption.order}
											className={`${styles.dropdownItem} ${styles.sortSubItem} ${sort.field === hoveredSortField && sort.order === subOption.order ? styles.selected : ''}`}
											onClick={() =>
												handleSortOrderSelect(
													hoveredSortField!,
													subOption.order
												)
											}
										>
											<span>{subOption.label}</span>
											{sort.field === hoveredSortField &&
												sort.order ===
													subOption.order && (
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
