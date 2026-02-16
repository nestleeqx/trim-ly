import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import cn from 'classnames'
import type { SkeletonBlockProps } from './types'
import styles from './AnalyticsSkeleton.module.scss'

export function AnalyticsSideCardsSkeleton({ className }: SkeletonBlockProps) {
	return (
		<div className={cn(styles.sideCharts, className)}>
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
