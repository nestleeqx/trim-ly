import { FiltersState } from '@/types/filterLinks'
import { useEffect, useRef } from 'react'

export default function useEmitLinksFiltersChange(
	onFiltersChange: ((filters: FiltersState) => void) | undefined,
	payload: FiltersState
) {
	const onFiltersChangeRef = useRef(onFiltersChange)

	useEffect(() => {
		onFiltersChangeRef.current = onFiltersChange
	}, [onFiltersChange])

	useEffect(() => {
		onFiltersChangeRef.current?.(payload)
	}, [payload])
}
