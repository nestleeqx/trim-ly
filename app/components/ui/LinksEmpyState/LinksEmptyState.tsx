'use client'

import { Link2, Plus, Search, X } from 'lucide-react'
import Button from '../Button'
import styles from './LinksEmptyState.module.scss'

interface LinksEmptyStateProps {
	hasLinks: boolean
	hasFilteredLinks: boolean
	hasActiveFilters: boolean
	onClearFilters: () => void
}

const LinksEmptyState = ({
	hasLinks,
	hasFilteredLinks,
	hasActiveFilters,
	onClearFilters
}: LinksEmptyStateProps) => {
	if (!hasLinks) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyStateIcon}>
					<Link2 size={36} />
				</div>
				<h3 className={styles.emptyStateTitle}>Ссылок пока нет</h3>
				<p className={styles.emptyStateText}>
					Создайте свою первую короткую ссылку и начните отслеживать
					переходы
				</p>
				<button className={styles.emptyStateButton}>
					<Plus size={18} />
					Создать первую ссылку
				</button>
			</div>
		)
	}

	if (!hasFilteredLinks) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyStateIcon}>
					<Search size={36} />
				</div>
				<h3 className={styles.emptyStateTitle}>Ссылки не найдены</h3>
				<p className={styles.emptyStateText}>
					По вашему запросу ничего не найдено. Попробуйте изменить
					параметры поиска.
				</p>
				{hasActiveFilters && (
					<Button
						variant='primary'
						onClick={onClearFilters}
					>
						<X size={16} />
						Сбросить фильтры
					</Button>
				)}
				<p className={styles.emptyStateHint}>
					Попробуйте другой поисковый запрос
				</p>
			</div>
		)
	}

	return null
}

export default LinksEmptyState
