import { LinkItem } from '@/types/links'
import { useCallback, useState } from 'react'

export const useLinksSelection = (paginatedLinks: LinkItem[]) => {
	const [selectedLinks, setSelectedLinks] = useState<string[]>([])

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			setSelectedLinks(checked ? paginatedLinks.map(link => link.id) : [])
		},
		[paginatedLinks]
	)

	const handleSelectLink = useCallback((id: string, checked: boolean) => {
		setSelectedLinks(prev =>
			checked ? [...prev, id] : prev.filter(linkId => linkId !== id)
		)
	}, [])

	const handleClearSelection = useCallback(() => {
		setSelectedLinks([])
	}, [])

	const isAllSelected =
		paginatedLinks.length > 0 &&
		paginatedLinks.every(link => selectedLinks.includes(link.id))

	const isSomeSelected = selectedLinks.length > 0

	return {
		selectedLinks,
		setSelectedLinks,
		handleSelectAll,
		handleSelectLink,
		handleClearSelection,
		isAllSelected,
		isSomeSelected
	}
}
