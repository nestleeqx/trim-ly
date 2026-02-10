'use client'

import { formatDate } from '@/utils/formatters'
import styles from './LinkTableRow.module.scss'

interface DateCellProps {
	date: string | Date
}

export default function DateCell({ date }: DateCellProps) {
	return (
		<td>
			<span className={styles.date}>{formatDate(date)}</span>
		</td>
	)
}
