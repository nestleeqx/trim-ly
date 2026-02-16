import { useEffect, useState } from 'react'

export function useDelayedFlag(active: boolean, delayMs = 180) {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		if (!active) return

		const timer = setTimeout(() => {
			setVisible(true)
		}, delayMs)

		return () => {
			clearTimeout(timer)
			setVisible(false)
		}
	}, [active, delayMs])

	return visible
}
