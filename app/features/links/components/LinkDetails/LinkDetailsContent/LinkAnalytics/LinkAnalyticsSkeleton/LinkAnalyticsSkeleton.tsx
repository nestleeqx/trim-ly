import {
	AnalyticsChartSkeleton,
	AnalyticsSideCardsSkeleton,
	AnalyticsStatsSkeleton,
	AnalyticsTableSkeleton
} from '@/app/components/ui/AnalyticsSkeleton/AnalyticsSkeleton'
import styles from './LinkAnalyticsSkeleton.module.scss'

export default function LinkAnalyticsSkeleton() {
	return (
		<div className={styles.wrapper}>
			<AnalyticsStatsSkeleton cardsCount={5} />
			<AnalyticsChartSkeleton />
			<AnalyticsSideCardsSkeleton />
			<AnalyticsTableSkeleton rows={6} />
		</div>
	)
}
