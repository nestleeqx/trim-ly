'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Button from '../../ui/Button'
import DonutChart from '../../ui/DonutChart/DonutChart'
import PeriodTabs from '../../ui/PeriodTabs/PeriodTabs'
import TrafficBarChart from '../../ui/TrafficBarChart/TrafficBarChart'
import { checklistItems, Period, periodData } from './analytics.config'
import styles from './Analytics.module.scss'

const Analytics: React.FC = () => {
	const [activePeriod, setActivePeriod] = useState<Period>('30d')
	const currentData = periodData[activePeriod]

	return (
		<section
			className={styles.analytics}
			id='analytics'
		>
			<div className='container'>
				<div className={styles.content}>
					<motion.div
						className={styles.left}
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
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
									onPeriodChange={setActivePeriod}
								/>
							</div>

							<div className={styles.dashboardContent}>
								<TrafficBarChart
									sources={currentData.trafficSources}
								/>
								<DonutChart
									mobilePercent={currentData.mobilePercent}
								/>
							</div>

							<div className={styles.dashboardFooter}>
								<span className={styles.footerLabel}>
									Топ локация
								</span>
								<span className={styles.footerValue}>
									{currentData.topLocation} (
									{currentData.topLocationPercent}%)
								</span>
							</div>
						</div>
					</motion.div>

					<motion.div
						className={styles.right}
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<span className={styles.badge}>АНАЛИТИКА</span>
						<h2 className={styles.title}>Узнайте, что работает</h2>
						<p className={styles.description}>
							Получите полную видимость эффективности ваших
							ссылок. Наша панель позволяет легко отслеживать
							тренды и оптимизировать стратегию.
						</p>

						<ul className={styles.checklist}>
							{checklistItems.map((item, index) => (
								<li
									key={index}
									className={styles.checklistItem}
								>
									<Check
										size={20}
										className={styles.checkIcon}
									/>
									<span>{item}</span>
								</li>
							))}
						</ul>

						<Link
							href='/signup'
							className={styles.link}
						>
							<Button
								variant='primary'
								size='lg'
							>
								Открыть аналитику
								<ArrowRight size={20} />
							</Button>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

export default Analytics
