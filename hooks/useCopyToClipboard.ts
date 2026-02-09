'use client'

import { useCallback, useState } from 'react'

interface UseCopyToClipboardProps {
	onCopy?: () => void
	timeout?: number
}

export const useCopyToClipboard = ({
	onCopy,
	timeout = 2000
}: UseCopyToClipboardProps = {}) => {
	const [copied, setCopied] = useState(false)

	const copy = useCallback(() => {
		onCopy?.()
		setCopied(true)
		setTimeout(() => setCopied(false), timeout)
	}, [onCopy, timeout])

	return {
		copied,
		copy
	}
}
