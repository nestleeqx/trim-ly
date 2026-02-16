import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import cn from 'classnames'
import type { SkeletonBlockProps } from './types'
import styles from './AnalyticsSkeleton.module.scss'

export function AnalyticsChartSkeleton({ className }: SkeletonBlockProps) {
	return (
		<div className={cn(styles.chartCard, className)}>
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
