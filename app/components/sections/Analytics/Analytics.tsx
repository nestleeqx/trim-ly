'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import Button from '../../ui/Button'
import styles from './Analytics.module.scss'

type Period = '7d' | '30d' | 'custom'

interface PeriodData {
	trafficSources: { name: string; value: number; color: string }[]
	mobilePercent: number
	topLocation: string
	topLocationPercent: number
	subtitle: string
}

const periodData: Record<Period, PeriodData> = {
	'7d': {
		trafficSources: [
			{ name: 'Instagram', value: 52, color: '#4f46e5' },
			{ name: 'Twitter', value: 22, color: '#94a3b8' },
			{ name: 'Direct', value: 15, color: '#cbd5e1' },
			{ name: 'Другие', value: 11, color: '#e2e8f0' }
		],
		mobilePercent: 72,
		topLocation: 'Германия',
		topLocationPercent: 38,
		subtitle: 'Результаты за 7 дней'
	},
	'30d': {
		trafficSources: [
			{ name: 'Instagram', value: 45, color: '#4f46e5' },
			{ name: 'Twitter', value: 28, color: '#94a3b8' },
			{ name: 'Direct', value: 18, color: '#cbd5e1' },
			{ name: 'Другие', value: 9, color: '#e2e8f0' }
		],
		mobilePercent: 65,
		topLocation: 'США',
		topLocationPercent: 42,
		subtitle: 'Результаты за 30 дней'
	},
	custom: {
		trafficSources: [
			{ name: 'Instagram', value: 38, color: '#4f46e5' },
			{ name: 'Twitter', value: 31, color: '#94a3b8' },
			{ name: 'Direct', value: 20, color: '#cbd5e1' },
			{ name: 'Другие', value: 11, color: '#e2e8f0' }
		],
		mobilePercent: 58,
		topLocation: 'Россия',
		topLocationPercent: 35,
		subtitle: 'Результаты за всё время'
	}
}

const Analytics: React.FC = () => {
	const [activePeriod, setActivePeriod] = useState<Period>('30d')

	const currentData = periodData[activePeriod]

	const checklistItems = [
		'Ежедневные и почасовые тренды кликов',
		'Отслеживание источников и кампаний',
		'Разбивка по устройствам и гео',
		'Экспорт статистики в CSV'
	]

	const circumference = 2 * Math.PI * 40
	const mobileStroke = (currentData.mobilePercent / 100) * circumference

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
								<div className={styles.tabs}>
									<button
										className={`${styles.tab} ${activePeriod === '7d' ? styles.active : ''}`}
										onClick={() => setActivePeriod('7d')}
									>
										7д
									</button>
									<button
										className={`${styles.tab} ${activePeriod === '30d' ? styles.active : ''}`}
										onClick={() => setActivePeriod('30d')}
									>
										30д
									</button>
									<button
										className={`${styles.tab} ${activePeriod === 'custom' ? styles.active : ''}`}
										onClick={() =>
											setActivePeriod('custom')
										}
									>
										Всё
									</button>
								</div>
							</div>

							<div className={styles.dashboardContent}>
								<div className={styles.barChart}>
									{currentData.trafficSources.map(source => (
										<div
											key={source.name}
											className={styles.barRow}
										>
											<span className={styles.barLabel}>
												{source.name}
											</span>
											<div className={styles.barTrack}>
												<div
													className={styles.barFill}
													style={{
														width: `${source.value}%`,
														backgroundColor:
															source.color
													}}
												/>
											</div>
										</div>
									))}
								</div>

								<div className={styles.donutSection}>
									<div className={styles.donut}>
										<svg
											viewBox='0 0 100 100'
											className={styles.donutSvg}
										>
											<circle
												cx='50'
												cy='50'
												r='40'
												fill='none'
												stroke='#e2e8f0'
												strokeWidth='12'
											/>
											<circle
												cx='50'
												cy='50'
												r='40'
												fill='none'
												stroke='#818cf8'
												strokeWidth='12'
												strokeDasharray={`${mobileStroke} ${circumference}`}
												strokeDashoffset={
													circumference * 0.25
												}
												strokeLinecap='round'
												style={{
													transition:
														'stroke-dasharray 0.5s ease'
												}}
											/>
										</svg>
										<div className={styles.donutCenter}>
											<span className={styles.donutValue}>
												{currentData.mobilePercent}%
											</span>
											<span className={styles.donutLabel}>
												MOBILE
											</span>
										</div>
									</div>
									<div className={styles.legend}>
										<div className={styles.legendItem}>
											<span
												className={styles.legendDot}
												style={{
													backgroundColor: '#818cf8'
												}}
											/>
											<span>Mobile</span>
										</div>
										<div className={styles.legendItem}>
											<span
												className={styles.legendDot}
												style={{
													backgroundColor: '#c4b5fd'
												}}
											/>
											<span>Desktop</span>
										</div>
										<div className={styles.legendItem}>
											<span
												className={styles.legendDot}
												style={{
													backgroundColor: '#e2e8f0'
												}}
											/>
											<span>Tablet</span>
										</div>
									</div>
								</div>
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
