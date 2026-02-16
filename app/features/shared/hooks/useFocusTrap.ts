'use client'

import { RefObject, useEffect } from 'react'

const FOCUSABLE_SELECTOR =
	'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type Options = {
	enabled?: boolean
}

export function useFocusTrap(
	containerRef: RefObject<HTMLElement | null>,
	options: Options = {}
) {
	const { enabled = true } = options

	useEffect(() => {
		if (!enabled) return

		const root = containerRef.current
		if (!root) return

		const focusables = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
		focusables[0]?.focus()

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') return

			const nodes = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			if (nodes.length === 0) {
				event.preventDefault()
				root.focus()
				return
			}

			const first = nodes[0]
			const last = nodes[nodes.length - 1]
			const active = document.activeElement as HTMLElement | null

			if (event.shiftKey) {
				if (active === first || !root.contains(active)) {
					event.preventDefault()
					last.focus()
				}
				return
			}

			if (active === last) {
				event.preventDefault()
				first.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [containerRef, enabled])
}
