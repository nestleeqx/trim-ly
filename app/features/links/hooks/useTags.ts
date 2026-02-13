import {
	createTag,
	deleteTag,
	getTags,
	type TagDto
} from '@/app/features/links/api/tagsApi'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function useTags(initialSelected: string[] = []) {
	const [tags, setTags] = useState<TagDto[]>([])
	const [selectedTagIds, setSelectedTagIds] =
		useState<string[]>(initialSelected)
	const [newTagName, setNewTagName] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [isCreating, setIsCreating] = useState(false)
	const [isDeleting, setIsDeleting] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const loadTags = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const list = await getTags()
			setTags(list)
		} catch (e) {
			setError(
				e instanceof Error ? e.message : 'Не удалось загрузить теги.'
			)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		loadTags()
	}, [loadTags])

	const toggleTag = useCallback((id: string) => {
		setSelectedTagIds(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		)
	}, [])

	const createAndSelectTag = useCallback(async () => {
		const name = newTagName.trim()
		if (!name) return

		setIsCreating(true)
		setError(null)

		try {
			const created = await createTag(name)

			setTags(prev => {
				const exists = prev.some(t => t.id === created.id)
				return exists ? prev : [...prev, created]
			})

			setSelectedTagIds(prev =>
				prev.includes(created.id) ? prev : [...prev, created.id]
			)

			setNewTagName('')
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Не удалось создать тег.')
		} finally {
			setIsCreating(false)
		}
	}, [newTagName])

	const removeTag = useCallback(async (id: string) => {
		setIsDeleting(id)
		setError(null)

		try {
			await deleteTag(id)
			setTags(prev => prev.filter(t => t.id !== id))
			setSelectedTagIds(prev => prev.filter(x => x !== id))
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Не удалось удалить тег.')
		} finally {
			setIsDeleting(null)
		}
	}, [])

	const selectedTags = useMemo(
		() => tags.filter(t => selectedTagIds.includes(t.id)),
		[tags, selectedTagIds]
	)

	return {
		tags,
		selectedTags,
		selectedTagIds,
		newTagName,
		setNewTagName,
		isLoading,
		isCreating,
		isDeleting,
		error,
		toggleTag,
		createAndSelectTag,
		removeTag,
		loadTags
	}
}
