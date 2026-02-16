'use client'

import cn from 'classnames'
import { Check, Tag } from 'lucide-react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'

interface TagsFilterProps {
	availableTags: string[]
	selectedTags: string[]
	onTagsChange: (tags: string[]) => void
	isLoading?: boolean
}

export default function TagsFilter({
	availableTags,
	selectedTags,
	onTagsChange,
	isLoading = false
}: TagsFilterProps) {
	const toggleTag = (tag: string) => {
		onTagsChange(
			selectedTags.includes(tag)
				? selectedTags.filter(t => t !== tag)
				: [...selectedTags, tag]
		)
	}

	return (
		<FilterDropdown
			label='Теги'
			icon={<Tag size={14} />}
			badgeCount={selectedTags.length}
			hasSelection={selectedTags.length > 0}
		>
			{isLoading ? (
				<div className={commonStyles.dropdownItem}>
					Загрузка тегов...
				</div>
			) : availableTags.length === 0 ? (
				<div className={commonStyles.dropdownItem}>Теги не найдены</div>
			) : (
				availableTags.map(tag => (
					<button
						key={tag}
						type='button'
						className={cn(commonStyles.dropdownItem, {
							[commonStyles.selected]: selectedTags.includes(tag)
						})}
						onClick={() => toggleTag(tag)}
					>
						<span className={commonStyles.checkbox}>
							{selectedTags.includes(tag) && <Check size={12} />}
						</span>
						{tag}
					</button>
				))
			)}
		</FilterDropdown>
	)
}
