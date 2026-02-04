'use client'

import { useState } from 'react'
import styles from '../../dashboard/LinkItem/LinkItem.module.scss'

interface TruncatedTextProps {
	text: string
	maxLength: number
	title?: string
	className?: string
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
	text,
	maxLength,
	title,
	className = ''
}) => {
	const [isExpanded, setIsExpanded] = useState(false)

	if (text.length <= maxLength) {
		return <span className={className}>{text}</span>
	}

	const displayText = isExpanded ? text : `${text.slice(0, maxLength)}…`

	return (
		<span
			className={`${styles.truncatedText} ${className}`}
			title={title || text}
			onClick={e => {
				e.stopPropagation()
				setIsExpanded(!isExpanded)
			}}
		>
			{displayText}
		</span>
	)
}

export default TruncatedText
