'use client'

import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import cn from 'classnames'
import styles from './LinksPageSkeleton.module.scss'

interface LinksPageSkeletonProps {
	rows?: number
	showFilters?: boolean
	showPagination?: boolean
	embedded?: boolean
	showMobileCards?: boolean
}

export default function LinksPageSkeleton({
	rows = 8,
	showFilters = true,
	showPagination = true,
	embedded = false,
	showMobileCards = false
}: LinksPageSkeletonProps) {
	return (
		<div
			className={cn(styles.container, {
				[styles.embedded]: embedded,
				[styles.mobileCardsEnabled]: showMobileCards
			})}
		>
			{showFilters && (
				<div className={styles.filters}>
					<Skeleton
						className={styles.filter}
						height={35}
						radius={12}
					/>
					<Skeleton
						className={styles.filter}
						height={35}
						radius={12}
					/>
					<Skeleton
						className={styles.filterShort}
						height={35}
						radius={12}
					/>
				</div>
			)}

			<div className={styles.tableCard}>
				<div className={styles.tableHeader}>
					<Skeleton
						className={styles.checkbox}
						height={16}
					/>
					<Skeleton
						className={styles.headerCell}
						height={14}
					/>
					<Skeleton
						className={styles.headerCell}
						height={14}
					/>
					<Skeleton
						className={styles.headerCell}
						height={14}
					/>
					<Skeleton
						className={styles.headerCell}
						height={14}
					/>
				</div>

				<div className={styles.body}>
					{Array.from({ length: rows }, (_, i) => (
						<div
							key={i}
							className={styles.row}
						>
							<Skeleton
								className={styles.checkbox}
								height={16}
							/>
							<Skeleton
								className={styles.title}
								height={16}
							/>
							<Skeleton
								className={styles.shortUrl}
								height={16}
							/>
							<Skeleton
								className={styles.clicks}
								height={16}
							/>
							<Skeleton
								className={styles.status}
								height={16}
							/>
						</div>
					))}
				</div>
			</div>

			{showMobileCards && (
				<div className={styles.mobileCards}>
					{Array.from({ length: Math.min(rows, 4) }, (_, i) => (
						<div
							key={`card-${i}`}
							className={styles.mobileCard}
						>
							<div className={styles.mobileCardHeader}>
								<Skeleton
									width={16}
									height={16}
								/>
								<Skeleton
									className={styles.mobileCardTitle}
									height={18}
								/>
							</div>
							<Skeleton
								className={styles.mobileCardLine}
								height={14}
							/>
							<Skeleton
								className={styles.mobileCardLine}
								height={14}
							/>
							<Skeleton
								className={styles.mobileCardLine}
								height={14}
							/>
							<Skeleton
								className={styles.mobileCardLine}
								height={14}
							/>
							<div className={styles.mobileCardActions}>
								<Skeleton
									className={styles.mobileCardAction}
									height={32}
								/>
								<Skeleton
									className={styles.mobileCardAction}
									height={32}
								/>
							</div>
						</div>
					))}
				</div>
			)}

			{showPagination && (
				<div className={styles.pagination}>
					<Skeleton
						className={styles.pageItem}
						height={34}
					/>
					<Skeleton
						className={styles.pageItem}
						height={34}
					/>
					<Skeleton
						className={styles.pageItem}
						height={34}
					/>
				</div>
			)}
		</div>
	)
}
