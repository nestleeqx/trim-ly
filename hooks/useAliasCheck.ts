'use client'

import { takenAliases } from '@/app/components/dashboard/LinkEdit/linkEdit.config'
import { useCallback, useEffect, useRef, useState } from 'react'

interface AliasCheckState {
	checking: boolean
	available: boolean | null
	checkedAlias: string
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
		checkedAlias: ''
	})
	const aliasCheckTimeout = useRef<NodeJS.Timeout | null>(null)

	const checkAliasAvailability = useCallback(
		(alias: string) => {
			if (aliasCheckTimeout.current) {
				clearTimeout(aliasCheckTimeout.current)
			}

			if (alias === initialAlias) {
				setAliasCheck({
					checking: false,
					available: null,
					checkedAlias: ''
				})
				onError(undefined)
				return
			}

			if (!alias) {
				setAliasCheck({
					checking: false,
					available: null,
					checkedAlias: ''
				})
				return
			}

			setAliasCheck(prev => ({ ...prev, checking: true }))

			aliasCheckTimeout.current = setTimeout(() => {
				const isTaken = takenAliases.includes(alias.toLowerCase())
				setAliasCheck({
					checking: false,
					available: !isTaken,
					checkedAlias: alias
				})

				if (isTaken) {
					onError('Этот alias уже занят')
				} else {
					onError(undefined)
				}
			}, 500)
		},
		[initialAlias, onError]
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
