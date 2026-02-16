import LinksPageSkeleton from '@/app/features/links/components/LinksPageSkeleton/LinksPageSkeleton'
import cn from 'classnames'
import type { SkeletonBlockProps } from './types'
import styles from './AnalyticsSkeleton.module.scss'

interface AnalyticsTableSkeletonProps extends SkeletonBlockProps {
	rows?: number
}

export function AnalyticsTableSkeleton({
	rows = 6,
	className
}: AnalyticsTableSkeletonProps) {
	return (
		<div className={cn(styles.tableSkeleton, className)}>
			<LinksPageSkeleton
				rows={rows}
				showFilters={false}
				showPagination
				embedded
			/>
		</div>
	)
}
