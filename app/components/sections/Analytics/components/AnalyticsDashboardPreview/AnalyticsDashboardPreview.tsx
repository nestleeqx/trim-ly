'use client'

import { motion } from 'framer-motion'
import { Period, periodData } from '../../analytics.config'
import styles from '../../Analytics.module.scss'
import DonutChart from '../DonutChart/DonutChart'
import PeriodTabs from '../PeriodTabs/PeriodTabs'
import TrafficBarChart from '../TrafficBarChart/TrafficBarChart'

interface AnalyticsDashboardPreviewProps {
	activePeriod: Period
	onPeriodChange: (period: Period) => void
}

export default function AnalyticsDashboardPreview({
	activePeriod,
	onPeriodChange
}: AnalyticsDashboardPreviewProps) {
	const currentData = periodData[activePeriod]

	return (
		<motion.div
			className={styles.left}
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.6 }}
		>
			<div className={styles.dashboard}>
				<div className={styles.dashboardHeader}>
					<div>
						<h4 className={styles.dashboardTitle}>
							Источник трафика
						</h4>
						<p className={styles.dashboardSubtitle}>
							{currentData.subtitle}
						</p>
					</div>
					<PeriodTabs
						activePeriod={activePeriod}
						onPeriodChange={onPeriodChange}
					/>
				</div>

				<div className={styles.dashboardContent}>
					<TrafficBarChart sources={currentData.trafficSources} />
					<DonutChart mobilePercent={currentData.mobilePercent} />
				</div>

				<div className={styles.dashboardFooter}>
					<span className={styles.footerLabel}>Топ локация</span>
					<span className={styles.footerValue}>
						{currentData.topLocation} (
						{currentData.topLocationPercent}%)
					</span>
				</div>
			</div>
		</motion.div>
	)
}
