'use client'

import Button from '@/app/components/ui/Button/Button'
import { SortState } from '@/types/filterLinks'
import cn from 'classnames'
import { Download } from 'lucide-react'
import styles from './FiltersRight.module.scss'
import SortDropdown from './SortDropdown/SortDropdown'
import ViewToggle from './ViewToggle/ViewToggle'

interface FiltersRightProps {
	sort: SortState
	onSortChange: (sort: SortState) => void
	viewMode: 'list' | 'grid'
	onViewModeChange: (mode: 'list' | 'grid') => void
	onExport?: () => void
	exportDisabled?: boolean
	exportLoading?: boolean
}

export default function FiltersRight({
	sort,
	onSortChange,
	viewMode,
	onViewModeChange,
	onExport,
	exportDisabled = false,
	exportLoading = false
}: FiltersRightProps) {
	const handleExport = () => {
		if (exportDisabled || exportLoading) return
		onExport?.()
	}

	return (
		<div className={styles.container}>
			<SortDropdown
				sort={sort}
				onSortChange={onSortChange}
			/>

			<ViewToggle
				viewMode={viewMode}
				onViewModeChange={onViewModeChange}
			/>

			<Button
				variant='ghost'
				type='button'
				className={cn(styles.exportBtn, {
					[styles.loading]: exportLoading
				})}
				onClick={handleExport}
				disabled={exportDisabled || exportLoading}
				aria-label='Экспорт CSV'
			>
				<Download size={16} />
				<span>{exportLoading ? 'Экспорт...' : 'Экспорт CSV'}</span>
			</Button>
		</div>
	)
}
