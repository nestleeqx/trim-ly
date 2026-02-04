'use client'

import { Search, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import styles from './LinksSearch.module.scss'

interface LinksSearchProps {
	value: string
	onChange: (value: string) => void
	onSearch: (value: string) => void
	placeholder?: string
	debounceMs?: number
}

const LinksSearch: React.FC<LinksSearchProps> = ({
	value,
	onChange,
	onSearch,
	placeholder = 'Поиск по названию, короткой ссылке или назначению…',
	debounceMs = 300
}) => {
	const [localValue, setLocalValue] = useState(value)

	useEffect(() => {
		setLocalValue(value)
	}, [value])

	const debouncedSearch = useCallback(
		(searchValue: string) => {
			const timeoutId = setTimeout(() => {
				onSearch(searchValue)
			}, debounceMs)

			return () => clearTimeout(timeoutId)
		},
		[onSearch, debounceMs]
	)

	useEffect(() => {
		const cleanup = debouncedSearch(localValue)
		return cleanup
	}, [localValue, debouncedSearch])

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		setLocalValue(newValue)
		onChange(newValue)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearch(localValue)
		}
		if (e.key === 'Escape') {
			handleClear()
		}
	}

	const handleClear = () => {
		setLocalValue('')
		onChange('')
		onSearch('')
	}

	return (
		<div className={styles.searchWrapper}>
			<Search size={18} className={styles.searchIcon} />
			<input
				type='text'
				value={localValue}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className={styles.searchInput}
				aria-label='Поиск ссылок'
			/>
			{localValue && (
				<button
					className={styles.clearBtn}
					onClick={handleClear}
					aria-label='Очистить поиск'
					type='button'
				>
					<X size={16} />
				</button>
			)}
		</div>
	)
}

export default LinksSearch
