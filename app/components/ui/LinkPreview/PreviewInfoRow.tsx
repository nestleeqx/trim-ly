'use client'

import { LucideIcon } from 'lucide-react'
import React from 'react'
import styles from './LinkPreview.module.scss'

interface PreviewInfoRowProps {
	icon: LucideIcon
	label: string
	value: string
}

export const PreviewInfoRow: React.FC<PreviewInfoRowProps> = ({
	icon: Icon,
	label,
	value
}) => {
	return (
		<div className={styles.previewSection}>
			<div className={styles.previewRow}>
				<div className={styles.previewRowIcon}>
					<Icon size={18} />
				</div>
				<span className={styles.previewRowLabel}>{label}</span>
				<span className={styles.previewRowValue}>{value}</span>
			</div>
		</div>
	)
}
