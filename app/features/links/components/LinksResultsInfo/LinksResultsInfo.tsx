'use client'

import styles from './LinksResultsInfo.module.scss'

interface LinksResultsInfoProps {
	totalFound: number
	searchQuery: string
}

export default function LinksResultsInfo({
	totalFound,
	searchQuery
}: LinksResultsInfoProps) {
	return (
		<div className={styles.resultsInfo}>
			<span>Найдено ссылок: {totalFound}</span>
			{searchQuery && (
				<span className={styles.searchInfo}>
					По запросу: &ldquo;{searchQuery}&rdquo;
				</span>
			)}
		</div>
	)
}
