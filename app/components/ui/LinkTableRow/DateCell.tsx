'use client'

import { formatDate } from '@/utils/formatters'
import React from 'react'
import styles from './LinkTableRow.module.scss'

interface DateCellProps {
	date: string | Date
}

export const DateCell: React.FC<DateCellProps> = ({ date }) => {
	return (
		<td>
			<span className={styles.date}>{formatDate(date)}</span>
		</td>
	)
}
