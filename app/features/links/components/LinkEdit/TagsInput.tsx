'use client'

import { Tag, X } from 'lucide-react'
import styles from './LinkEdit.module.scss'
import useTagsInput from './hooks/useTagsInput'
import { MAX_TAG_LENGTH } from './linkEdit.config'

interface TagsInputProps {
	tags: string[]
	onChange: (tags: string[]) => void
	maxTags?: number
}

export default function TagsInput({
	tags,
	onChange,
	maxTags = 5
}: TagsInputProps) {
	const vm = useTagsInput({ tags, onChange, maxTags })

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>
				<Tag size={16} /> Теги
			</label>

			<div className={styles.tagsContainer}>
				<div className={styles.tagsWrapper}>
					{vm.tags.map(tag => (
						<span
							key={tag}
							className={styles.tag}
						>
							{tag}
							<button
								type='button'
								className={styles.tagRemove}
								onClick={() => vm.removeTag(tag)}
							>
								<X size={12} />
							</button>
						</span>
					))}

					<input
						name='tags-input'
						className={styles.tagInput}
						placeholder='Добавить тег...'
						disabled={vm.limitReached}
						value={vm.value}
						autoComplete='off'
						autoCorrect='off'
						spellCheck={false}
						onChange={e => vm.setValue(e.target.value)}
						onFocus={() => vm.setOpen(true)}
						onBlur={() => setTimeout(() => vm.setOpen(false), 200)}
						onKeyDown={vm.handleKeyDown}
						maxLength={MAX_TAG_LENGTH}
					/>
				</div>

				{vm.limitReached ? (
					<span className={styles.hint}>Максимум {maxTags} тегов</span>
				) : null}

				{vm.open && vm.filtered.length > 0 && !vm.limitReached ? (
					<div className={styles.tagSuggestions}>
						{vm.filtered.slice(0, 5).map(tag => (
							<button
								key={tag}
								type='button'
								className={styles.tagSuggestion}
								onMouseDown={() => vm.addTag(tag)}
							>
								{tag}
							</button>
						))}
					</div>
				) : null}
			</div>

			<span className={styles.hint}>
				Максимум {MAX_TAG_LENGTH} символов на тег.
			</span>
		</div>
	)
}
