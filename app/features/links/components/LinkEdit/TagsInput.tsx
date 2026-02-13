'use client'

import { getTags } from '@/app/features/links/api/tagsApi'
import { Tag, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import styles from './LinkEdit.module.scss'
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
	const [existingTags, setExistingTags] = useState<string[]>([])

	const [value, setValue] = useState('')
	const [open, setOpen] = useState(false)

	const limitReached = tags.length >= maxTags
	const q = value.trim().toLowerCase()

	useEffect(() => {
		let isMounted = true

		getTags()
			.then(list => {
				if (!isMounted) return
				setExistingTags(list.map(t => t.name))
			})
			.catch(() => {
				if (!isMounted) return
				setExistingTags([])
			})

		return () => {
			isMounted = false
		}
	}, [])

	const filtered = useMemo(() => {
		const base = existingTags.filter(t => !tags.includes(t))
		return q ? base.filter(t => t.toLowerCase().includes(q)) : base
	}, [existingTags, q, tags])

	const close = () => {
		setValue('')
		setOpen(false)
	}

	const add = (raw: string) => {
		const t = raw.trim()
		if (!t || t.length > MAX_TAG_LENGTH || limitReached || tags.includes(t))
			return close()
		onChange([...tags, t])
		close()
	}

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>
				<Tag size={16} /> Теги
			</label>

			<div className={styles.tagsContainer}>
				<div className={styles.tagsWrapper}>
					{tags.map(t => (
						<span
							key={t}
							className={styles.tag}
						>
							{t}
							<button
								type='button'
								className={styles.tagRemove}
								onClick={() =>
									onChange(tags.filter(x => x !== t))
								}
							>
								<X size={12} />
							</button>
						</span>
					))}

					<input
						name='tags-input'
						className={styles.tagInput}
						placeholder='Добавить тег...'
						disabled={limitReached}
						value={value}
						autoComplete='off'
						autoCorrect='off'
						spellCheck={false}
						onChange={e => setValue(e.target.value)}
						onFocus={() => setOpen(true)}
						onBlur={() => setTimeout(() => setOpen(false), 200)}
						onKeyDown={e => {
							if (e.key === 'Enter' && value.trim()) {
								e.preventDefault()
								add(value)
							}
						}}
						maxLength={MAX_TAG_LENGTH}
					/>
				</div>

				{limitReached && (
					<span className={styles.hint}>
						Максимум {maxTags} тегов
					</span>
				)}

				{open && filtered.length > 0 && !limitReached && (
					<div className={styles.tagSuggestions}>
						{filtered.slice(0, 5).map(t => (
							<button
								key={t}
								type='button'
								className={styles.tagSuggestion}
								onMouseDown={() => add(t)}
							>
								{t}
							</button>
						))}
					</div>
				)}
			</div>
			<span className={styles.hint}>
				Максимум {MAX_TAG_LENGTH} символов на тег.
			</span>
		</div>
	)
}
