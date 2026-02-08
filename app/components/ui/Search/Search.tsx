'use client'

import { Search as SearchIcon, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Search.module.scss'

interface SearchProps {
	value: string
	onChange: (value: string) => void
	onSearch?: (value: string) => void
	placeholder?: string
	autoSubmit?: boolean
	debounceMs?: number
}

export const Search = ({
	value,
	onChange,
	onSearch,
	placeholder = 'Поиск...',
	autoSubmit = false,
	debounceMs = 300
}: SearchProps) => {
	const [isFocused, setIsFocused] = useState(false)
	const debounceRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [])

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value
			onChange(newValue)

			if (autoSubmit && onSearch) {
				if (debounceRef.current) clearTimeout(debounceRef.current)
				debounceRef.current = setTimeout(
					() => onSearch(newValue),
					debounceMs
				)
			}
		},
		[onChange, onSearch, autoSubmit, debounceMs]
	)

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && onSearch) {
			if (debounceRef.current) clearTimeout(debounceRef.current)
			onSearch(value)
		}
		if (e.key === 'Escape') {
			onChange('')
			onSearch?.('')
		}
	}

	const handleClear = () => {
		onChange('')
		onSearch?.('')
	}

	return (
		<div className={`${styles.search} ${isFocused ? styles.focused : ''}`}>
			<SearchIcon
				size={18}
				className={styles.icon}
			/>

			<input
				type='text'
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder={placeholder}
				className={styles.input}
			/>

			{value && (
				<button
					type='button'
					onClick={handleClear}
					className={styles.clear}
					aria-label='Очистить'
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}
