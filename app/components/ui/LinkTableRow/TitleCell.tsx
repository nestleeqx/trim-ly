'use client'

import React from 'react'
import styles from './LinkTableRow.module.scss'

interface TitleCellProps {
	title: string
	onTitleClick: (e: React.MouseEvent) => void
}

export const TitleCell: React.FC<TitleCellProps> = ({
	title,
	onTitleClick
}) => {
	return (
		<td>
			<div className={styles.titleCell}>
				<span
					className={`${styles.linkTitle} ${styles.clickableTitle}`}
					onClick={onTitleClick}
				>
					{title}
				</span>
			</div>
		</td>
	)
}
