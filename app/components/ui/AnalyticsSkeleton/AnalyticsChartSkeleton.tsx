import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import cn from 'classnames'
import styles from './AnalyticsSkeleton.module.scss'
import type { SkeletonBlockProps } from './types'

export function AnalyticsChartSkeleton({ className }: SkeletonBlockProps) {
	return (
		<div className={cn(styles.chartCard, className)}>
			<div className={styles.chartCardHeader}>
				<div>
					<Skeleton
						className={styles.chartCardTitle}
						width='clamp(140px, 42vw, 200px)'
						height={30}
					/>
					<Skeleton
						width='clamp(90px, 24vw, 120px)'
						height={30}
					/>
				</div>
				<Skeleton
					width='clamp(140px, 40vw, 200px)'
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
