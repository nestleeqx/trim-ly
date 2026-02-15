import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import LinksPageSkeleton from '@/app/features/links/components/LinksPageSkeleton/LinksPageSkeleton'
import styles from './AnalyticsSkeleton.module.scss'

interface SkeletonBlockProps {
	className?: string
	cardsCount?: number
}

export function AnalyticsStatsSkeleton({
	className,
	cardsCount = 4
}: SkeletonBlockProps) {
	return (
		<div className={`${styles.statsGrid} ${className ?? ''}`.trim()}>
			{Array.from({ length: cardsCount }).map((_, idx) => (
				<div
					key={idx}
					className={styles.statsCard}
				>
					<div className={styles.statCardHeader}>
						<Skeleton
							width={45}
							height={45}
							radius={12}
						/>
						<Skeleton
							width={45}
							height={30}
						/>
					</div>
					<Skeleton
						className={styles.statCardTitle}
						width={50}
						height={30}
					/>
					<Skeleton
						width={150}
						height={20}
					/>
				</div>
			))}
		</div>
	)
}

export function AnalyticsChartSkeleton({ className }: SkeletonBlockProps) {
	return (
		<div className={`${styles.chartCard} ${className ?? ''}`.trim()}>
			<div className={styles.chartCardHeader}>
				<div>
					<Skeleton
						className={styles.chartCardTitle}
						width={200}
						height={30}
					/>
					<Skeleton
						width={120}
						height={30}
					/>
				</div>
				<Skeleton
					width={200}
					height={30}
				/>
			</div>
			<Skeleton className={styles.chartContent} />
			<div className={styles.chartContentDetails}>
				<Skeleton
					width={70}
					height={30}
				/>
				<Skeleton
					width={70}
					height={30}
				/>
			</div>
		</div>
	)
}

export function AnalyticsSideCardsSkeleton({ className }: SkeletonBlockProps) {
	return (
		<div className={`${styles.sideCharts} ${className ?? ''}`.trim()}>
			{Array.from({ length: 3 }).map((_, idx) => (
				<div
					key={idx}
					className={styles.sideCard}
				>
					<Skeleton
						width={170}
						height={30}
					/>
					<div className={styles.sideCardContent}>
						<Skeleton height={20} />
						<Skeleton height={20} />
						<Skeleton height={20} />
					</div>
				</div>
			))}
		</div>
	)
}

interface AnalyticsTableSkeletonProps extends SkeletonBlockProps {
	rows?: number
}

export function AnalyticsTableSkeleton({
	rows = 6,
	className
}: AnalyticsTableSkeletonProps) {
	return (
		<div className={`${styles.tableSkeleton} ${className ?? ''}`.trim()}>
			<LinksPageSkeleton
				rows={rows}
				showFilters={false}
				showPagination
				embedded
			/>
		</div>
	)
}
