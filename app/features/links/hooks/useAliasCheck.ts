'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface AliasCheckState {
	checking: boolean
	available: boolean | null
	checkedAlias: string
	suggestions: string[]
}

interface UseAliasCheckProps {
	initialAlias: string
	excludeId?: string
	onError: (error: string | undefined) => void
}

export const useAliasCheck = ({
	initialAlias,
	excludeId,
	onError
}: UseAliasCheckProps) => {
	const [aliasCheck, setAliasCheck] = useState<AliasCheckState>({
		checking: false,
		available: null,
		checkedAlias: '',
		suggestions: []
	})

	const aliasCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
	const requestIdRef = useRef(0)
	const requestAbortRef = useRef<AbortController | null>(null)

	const checkAliasAvailability = useCallback(
		(alias: string) => {
			if (aliasCheckTimeout.current) clearTimeout(aliasCheckTimeout.current)
			if (requestAbortRef.current) {
				requestAbortRef.current.abort()
				requestAbortRef.current = null
			}

			if (alias === initialAlias) {
				setAliasCheck({
					checking: false,
					available: null,
					checkedAlias: '',
					suggestions: []
				})
				onError(undefined)
				return
			}

			if (!alias) {
				setAliasCheck({
					checking: false,
					available: null,
					checkedAlias: '',
					suggestions: []
				})
				onError(undefined)
				return
			}

			setAliasCheck(prev => ({ ...prev, checking: true, suggestions: [] }))

			aliasCheckTimeout.current = setTimeout(() => {
				const requestId = ++requestIdRef.current
				const controller = new AbortController()
				requestAbortRef.current = controller

				const params = new URLSearchParams({ slug: alias })
				if (excludeId) params.set('excludeId', excludeId)

				void fetch(`/api/links/check-slug?${params.toString()}`, {
					method: 'GET',
					signal: controller.signal,
					cache: 'no-store'
				})
					.then(async res => {
						if (!res.ok) throw new Error('Alias check failed')
						return (await res.json()) as {
							available: boolean
							suggestions?: string[]
						}
					})
					.then(data => {
						if (requestId !== requestIdRef.current) return

						const available = !!data.available
						const suggestions = available
							? []
							: (data.suggestions ?? [])

						setAliasCheck({
							checking: false,
							available,
							checkedAlias: alias,
							suggestions
						})

						onError(available ? undefined : 'Этот alias уже занят.')
					})
					.catch(error => {
						if (
							error instanceof DOMException &&
							error.name === 'AbortError'
						) {
							return
						}
						if (requestId !== requestIdRef.current) return
						setAliasCheck({
							checking: false,
							available: null,
							checkedAlias: alias,
							suggestions: []
						})
					})
			}, 500)
		},
		[initialAlias, excludeId, onError]
	)

	useEffect(() => {
		return () => {
			if (aliasCheckTimeout.current) clearTimeout(aliasCheckTimeout.current)
			if (requestAbortRef.current) requestAbortRef.current.abort()
		}
	}, [])

	return {
		aliasCheck,
		checkAliasAvailability
	}
}

