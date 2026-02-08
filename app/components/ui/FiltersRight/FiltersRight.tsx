'use client'

import { SortState } from '@/types/filterLinks'
import { Download } from 'lucide-react'
import { useState } from 'react'
import SortDropdown from '../SortDropdown/SortDropdown'
import ViewToggleInline from '../ViewToggle/ViewToggle'
import styles from './FiltersRight.module.scss'

interface FiltersRightProps {
	sort: SortState
	onSortChange: (sort: SortState) => void
	viewMode: 'list' | 'grid'
	onViewModeChange: (mode: 'list' | 'grid') => void
	onExport?: () => void
	exportDisabled?: boolean
	exportLoading?: boolean
}

const FiltersRight: React.FC<FiltersRightProps> = ({
	sort,
	onSortChange,
	viewMode,
	onViewModeChange,
	onExport,
	exportDisabled = false,
	exportLoading = false
}) => {
	const [isExporting, setIsExporting] = useState(false)

	const handleExport = async () => {
		if (exportDisabled || isExporting) return

		setIsExporting(true)
		try {
			await onExport?.()
		} finally {
			setIsExporting(false)
		}
	}

	return (
		<div className={styles.container}>
			<SortDropdown
				sort={sort}
				onSortChange={onSortChange}
			/>

			<ViewToggleInline
				viewMode={viewMode}
				onViewModeChange={onViewModeChange}
			/>

			<button
				className={`${styles.exportBtn} ${exportLoading || isExporting ? styles.loading : ''}`}
				onClick={handleExport}
				disabled={exportDisabled || exportLoading || isExporting}
				aria-label='Экспорт CSV'
			>
				<Download size={16} />
				<span>
					{exportLoading || isExporting
						? 'Экспорт...'
						: 'Экспорт CSV'}
				</span>
			</button>
		</div>
	)
}

export default FiltersRight
