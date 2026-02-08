'use client'

import React from 'react'
import styles from './LinkTableRow.module.scss'

interface ClicksCellProps {
	clicks: number
}

/**
 * ClicksCell - рендерит ячейку количества кликов с форматированием
 */
export const ClicksCell: React.FC<ClicksCellProps> = ({ clicks }) => {
	return (
		<td>
			<span className={styles.clicks}>{clicks.toLocaleString()}</span>
		</td>
	)
}
