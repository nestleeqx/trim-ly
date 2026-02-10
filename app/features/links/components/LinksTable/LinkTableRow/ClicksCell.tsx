'use client'

import styles from './LinkTableRow.module.scss'

interface ClicksCellProps {
	clicks: number
}

export default function ClicksCell({ clicks }: ClicksCellProps) {
	return (
		<td>
			<span className={styles.clicks}>{clicks.toLocaleString()}</span>
		</td>
	)
}
