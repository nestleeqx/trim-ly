'use client'

import { getTags } from '@/app/features/links/api/tagsApi'
import { KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { MAX_TAG_LENGTH } from '../linkEdit.config'

interface UseTagsInputParams {
	tags: string[]
	onChange: (tags: string[]) => void
	maxTags: number
}

export default function useTagsInput({
	tags,
	onChange,
	maxTags
}: UseTagsInputParams) {
	const [existingTags, setExistingTags] = useState<string[]>([])
	const [value, setValue] = useState('')
	const [open, setOpen] = useState(false)

	const limitReached = tags.length >= maxTags
	const query = value.trim().toLowerCase()

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
		const base = existingTags.filter(tag => !tags.includes(tag))
		return query
			? base.filter(tag => tag.toLowerCase().includes(query))
			: base
	}, [existingTags, query, tags])

	const close = () => {
		setValue('')
		setOpen(false)
	}

	const addTag = (raw: string) => {
		const tag = raw.trim()
		if (
			!tag ||
			tag.length > MAX_TAG_LENGTH ||
			limitReached ||
			tags.includes(tag)
		) {
			return close()
		}

		onChange([...tags, tag])
		close()
	}

	const removeTag = (tag: string) => {
		onChange(tags.filter(t => t !== tag))
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || !value.trim()) return
		e.preventDefault()
		addTag(value)
	}

	return {
		tags,
		value,
		open,
		filtered,
		limitReached,
		setValue,
		setOpen,
		addTag,
		removeTag,
		handleKeyDown
	}
}
