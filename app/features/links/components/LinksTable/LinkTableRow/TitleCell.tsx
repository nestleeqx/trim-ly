'use client'

import cn from 'classnames'
import Link from 'next/link'
import styles from './LinkTableRow.module.scss'

interface TitleCellProps {
	title: string
	href: string
}

export default function TitleCell({ title, href }: TitleCellProps) {
	return (
		<td>
			<div className={styles.titleCell}>
				<Link
					href={href}
					className={cn(styles.linkTitle, styles.clickableTitle)}
					aria-label={`Открыть ссылку ${title}`}
				>
					{title}
				</Link>
			</div>
		</td>
	)
}
