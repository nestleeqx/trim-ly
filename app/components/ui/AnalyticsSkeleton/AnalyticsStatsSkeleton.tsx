import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import cn from 'classnames'
import type { SkeletonBlockProps } from './types'
import styles from './AnalyticsSkeleton.module.scss'

export function AnalyticsStatsSkeleton({
	className,
	cardsCount = 4
}: SkeletonBlockProps) {
	return (
		<div className={cn(styles.statsGrid, className)}>
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
