'use client'

import { takenAliases } from '@/app/features/links/components/LinkEdit/linkEdit.config'
import { useCallback, useEffect, useRef, useState } from 'react'

interface AliasCheckState {
	checking: boolean
	available: boolean | null
	checkedAlias: string
	suggestions: string[]
}

interface UseAliasCheckProps {
	initialAlias: string
	onError: (error: string | undefined) => void
}

export const useAliasCheck = ({
	initialAlias,
	onError
}: UseAliasCheckProps) => {
	const [aliasCheck, setAliasCheck] = useState<AliasCheckState>({
		checking: false,
		available: null,
		checkedAlias: '',
		suggestions: []
	})
	const aliasCheckTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

	const buildSuggestions = useCallback(
		(alias: string) => {
			const year = new Date().getFullYear()
			const variants = [
				`${alias}-1`,
				`${alias}-${year}`,
				`${alias}-app`,
				`${alias}-link`,
				`${alias}-new`
			]

			return [...new Set(variants)]
				.map(item => item.toLowerCase().slice(0, 25))
				.filter(
					item =>
						!!item &&
						item !== alias &&
						item !== initialAlias &&
						!takenAliases.includes(item)
				)
				.slice(0, 3)
		},
		[initialAlias]
	)

	const checkAliasAvailability = useCallback(
		(alias: string) => {
			if (aliasCheckTimeout.current) {
				clearTimeout(aliasCheckTimeout.current)
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
				return
			}

			setAliasCheck(prev => ({ ...prev, checking: true, suggestions: [] }))

			aliasCheckTimeout.current = setTimeout(() => {
				const isTaken = takenAliases.includes(alias.toLowerCase())
				const suggestions = isTaken ? buildSuggestions(alias) : []

				setAliasCheck({
					checking: false,
					available: !isTaken,
					checkedAlias: alias,
					suggestions
				})

				if (isTaken) {
					onError('Этот alias уже занят.')
				} else {
					onError(undefined)
				}
			}, 500)
		},
		[initialAlias, onError, buildSuggestions]
	)

	useEffect(() => {
		return () => {
			if (aliasCheckTimeout.current) {
				clearTimeout(aliasCheckTimeout.current)
			}
		}
	}, [])

	return {
		aliasCheck,
		checkAliasAvailability
	}
}
