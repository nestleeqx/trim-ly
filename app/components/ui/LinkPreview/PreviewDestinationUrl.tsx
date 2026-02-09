'use client'

import { Link2 } from 'lucide-react'
import React from 'react'
import styles from './LinkPreview.module.scss'

interface PreviewDestinationUrlProps {
	url: string
}

export const PreviewDestinationUrl: React.FC<PreviewDestinationUrlProps> = ({
	url
}) => {
	const displayUrl = url || 'https://example.com/long-url'

	return (
		<div className={styles.previewSection}>
			<span className={styles.previewLabel}>ОРИГИНАЛЬНЫЙ URL</span>
			<div className={styles.originalUrl}>
				<Link2
					size={16}
					className={styles.urlIcon}
				/>
				<span className={styles.urlText}>{displayUrl}</span>
			</div>
		</div>
	)
}
