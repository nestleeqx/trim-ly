'use client'

import Button from '@/app/components/ui/Button/Button'
import { Link2, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import styles from './LinksEmptyState.module.scss'

interface LinksEmptyStateProps {
	hasLinks: boolean
	hasFilteredLinks: boolean
	hasActiveFilters: boolean
	onClearFilters: () => void
	isLoading?: boolean
}

export default function LinksEmptyState({
	hasLinks,
	hasFilteredLinks,
	hasActiveFilters,
	onClearFilters,
	isLoading = false
}: LinksEmptyStateProps) {
	if (!hasLinks) {
		return (
			<div className={styles.emptyState}>
				<div className={styles.emptyStateIcon}>
					<Link2 size={36} />
				</div>
				<h3 className={styles.emptyStateTitle}>Ссылок пока нет</h3>
				<p className={styles.emptyStateText}>
					Создайте свою первую короткую ссылку и начните отслеживать переходы
				</p>
				<Link href='/links/new' className={styles.createBtn}>
					<Button variant='primary'>
						<Plus size={18} />
						Создать первую ссылку
					</Button>
				</Link>
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
					По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
				</p>
				{hasActiveFilters && (
					<Button variant='primary' onClick={onClearFilters} disabled={isLoading}>
						<X size={16} />
						{isLoading ? 'Обновляем...' : 'Сбросить фильтры'}
					</Button>
				)}
				<p className={styles.emptyStateHint}>Попробуйте другой поисковый запрос</p>
			</div>
		)
	}

	return null
}
