'use client'

import cn from 'classnames'
import styles from './LinksResultsInfo.module.scss'

interface LinksResultsInfoProps {
	totalFound: number
	searchQuery: string
	hideOnDesktopWhenSelected?: boolean
}

export default function LinksResultsInfo({
	totalFound,
	searchQuery,
	hideOnDesktopWhenSelected = false
}: LinksResultsInfoProps) {
	return (
		<div
			className={cn(styles.resultsInfo, {
				[styles.hideOnDesktopWhenSelected]: hideOnDesktopWhenSelected
			})}
		>
			<span>Найдено ссылок: {totalFound}</span>
			{searchQuery && (
				<span className={styles.searchInfo}>
					По запросу: &ldquo;{searchQuery}&rdquo;
				</span>
			)}
		</div>
	)
}
