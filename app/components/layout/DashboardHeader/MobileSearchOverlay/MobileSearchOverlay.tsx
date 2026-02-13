'use client'

import Search from '@/app/components/layout/DashboardHeader/Search/Search'
import { SearchConfig } from '@/app/components/layout/DashboardHeader/types'
import { X } from 'lucide-react'
import styles from './MobileSearchOverlay.module.scss'

interface MobileSearchOverlayProps {
	search: SearchConfig
	onClose: () => void
}

export default function MobileSearchOverlay({
	search,
	onClose
}: MobileSearchOverlayProps) {
	return (
		<div className={styles.mobileSearch}>
			<div className={styles.mobileSearchInner}>
				<Search
					value={search.value}
					onChange={search.onChange}
					onSearch={search.onSearch}
					placeholder={search.placeholder}
					autoSubmit={search.autoSubmit}
					debounceMs={search.debounceMs}
				/>
				<button
					type='button'
					className={styles.closeSearch}
					onClick={onClose}
					aria-label='Закрыть поиск'
				>
					<X size={20} />
				</button>
			</div>
		</div>
	)
}
