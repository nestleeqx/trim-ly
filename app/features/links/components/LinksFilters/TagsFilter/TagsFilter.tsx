'use client'

import { Check, Tag } from 'lucide-react'
import commonStyles from '../FilterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'

interface TagsFilterProps {
	selectedTags: string[]
	onTagsChange: (tags: string[]) => void
}

const availableTags = ['АКЦИЯ', 'СОЦСЕТИ', 'ЗАПУСК', 'ЗИМА', 'РЕФЕРАЛ']

export default function TagsFilter({
	selectedTags,
	onTagsChange
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
			{availableTags.map(tag => (
				<button
					key={tag}
					className={`${commonStyles.dropdownItem} ${selectedTags.includes(tag) ? commonStyles.selected : ''}`}
					onClick={() => toggleTag(tag)}
				>
					<span className={commonStyles.checkbox}>
						{selectedTags.includes(tag) && <Check size={12} />}
					</span>
					{tag}
				</button>
			))}
		</FilterDropdown>
	)
}
