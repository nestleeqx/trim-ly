'use client'

import {
	LinksFiltersProps,
	SortState,
	StatusFilter as StatusFilterType
} from '@/types/filterLinks'
import { Filter, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import DateFilter from './DateFilter/DateFilter'
import FiltersRight from './FiltersRight/FiltersRight'
import styles from './LinksFilters.module.scss'
import StatusFilter from './StatusFilter/StatusFilter'
import TagsFilter from './TagsFilter/TagsFilter'

interface EnhancedLinksFiltersProps extends LinksFiltersProps {
	viewMode?: 'list' | 'grid'
	onViewModeChange?: (mode: 'list' | 'grid') => void
	onExport?: () => void
	exportLoading?: boolean
}

const LinksFilters: React.FC<EnhancedLinksFiltersProps> = ({
	onFiltersChange,
	viewMode = 'list',
	onViewModeChange,
	onExport,
	exportLoading
}) => {
	const [sort, setSort] = useState<SortState>({
		field: 'created_date',
		order: 'desc'
	})
	const [selectedStatuses, setSelectedStatuses] = useState<
		StatusFilterType[]
	>([])
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [datePreset, setDatePreset] = useState<
		'7d' | '30d' | 'custom' | null
	>(null)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [customDateLabel, setCustomDateLabel] = useState('')
	const [showDatePicker, setShowDatePicker] = useState(false)

	const hasActiveFilters =
		selectedStatuses.length > 0 ||
		selectedTags.length > 0 ||
		datePreset !== null

	const clearFilters = () => {
		setSelectedStatuses([])
		setSelectedTags([])
		setDatePreset(null)
		setStartDate('')
		setEndDate('')
		setCustomDateLabel('')
		setSort({ field: 'created_date', order: 'desc' })
		setShowDatePicker(false)
	}

	useEffect(() => {
		onFiltersChange?.({
			statuses: selectedStatuses,
			tags: selectedTags,
			datePreset,
			sort,
			viewMode
		})
	}, [selectedStatuses, selectedTags, datePreset, sort, viewMode])

	return (
		<div className={styles.container}>
			<div className={styles.filtersLeft}>
				<span className={styles.filtersLabel}>
					<Filter size={16} />
					Фильтры
				</span>

				<StatusFilter
					selectedStatuses={selectedStatuses}
					onStatusChange={setSelectedStatuses}
				/>

				<TagsFilter
					selectedTags={selectedTags}
					onTagsChange={setSelectedTags}
				/>

				<DateFilter
					datePreset={datePreset}
					onDatePresetChange={setDatePreset}
					startDate={startDate}
					endDate={endDate}
					customDateLabel={customDateLabel}
					onStartDateChange={setStartDate}
					onEndDateChange={setEndDate}
					onCustomDateLabelChange={setCustomDateLabel}
					showDatePicker={showDatePicker}
					onShowDatePickerChange={setShowDatePicker}
				/>

				{hasActiveFilters && (
					<button
						className={styles.clearBtn}
						onClick={clearFilters}
					>
						<X size={14} />
						Сбросить
					</button>
				)}
			</div>

			<FiltersRight
				sort={sort}
				onSortChange={setSort}
				viewMode={viewMode}
				onViewModeChange={onViewModeChange}
				onExport={onExport}
				exportLoading={exportLoading}
			/>
		</div>
	)
}

export default LinksFilters
