'use client'

import classNames from 'classnames'
import {
	BarChart3,
	CheckCircle2,
	Copy,
	ExternalLink,
	Lock,
	QrCode,
	Smartphone,
	Zap
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import Button from '../../ui/Button'
import DemoModal from '../../ui/DemoModal'
import styles from './Hero.module.scss'

const Hero: React.FC = () => {
	const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

	const chartData = [
		{ name: 'Пн', clicks: 400 },
		{ name: 'Вт', clicks: 600 },
		{ name: 'Ср', clicks: 500 },
		{ name: 'Чт', clicks: 700 },
		{ name: 'Пт', clicks: 900 },
		{ name: 'Сб', clicks: 800 },
		{ name: 'Вс', clicks: 1000 }
	]

	const links = [
		{
			title: 'Летняя кампания',
			slug: 's.to/summer',
			clicks: 1248,
			status: 'active'
		},
		{
			title: 'Социальный запуск',
			slug: 's.to/social',
			clicks: 954,
			status: 'active'
		},
		{
			title: 'Рассылка Q4',
			slug: 's.to/news-q4',
			clicks: 4102,
			status: 'active'
		}
	]

	const features = [
		{
			icon: CheckCircle2,
			text: 'Неограниченные редиректы'
		},
		{
			icon: Lock,
			text: 'Приватная статистика'
		},
		{
			icon: Smartphone,
			text: 'Работает на мобильных'
		}
	]

	return (
		<section className={styles.hero}>
			<div className='container'>
				<div className={styles.content}>
					<div className={styles.left}>
						<div className={styles.badge}>
							<Zap size={16} />
							<span>КОРОТКИЕ ССЫЛКИ + АНАЛИТИКА + QR</span>
						</div>

						<h1 className={styles.title}>
							Сокращайте ссылки. Отслеживайте клики. Делитесь
							умнее.
						</h1>

						<p className={styles.description}>
							Создавайте брендированные короткие ссылки,
							генерируйте QR-коды и анализируйте эффективность с
							помощью аналитики в реальном времени.
						</p>

						<div className={styles.actions}>
							<Link href='/signup'>
								<Button
									variant='primary'
									size='lg'
								>
									Создать аккаунт
								</Button>
							</Link>
							<Button
								variant='ghost'
								size='lg'
								onClick={() => setIsDemoModalOpen(true)}
							>
								Посмотреть демо
							</Button>
						</div>

						<p className={styles.note}>
							Привязка карты не требуется
						</p>

						<div className={styles.features}>
							{features.map((feature, index) => {
								const IconComponent = feature.icon
								return (
									<div
										key={index}
										className={styles.feature}
									>
										<IconComponent size={20} />
										<span>{feature.text}</span>
									</div>
								)
							})}
						</div>
					</div>

					<div className={styles.right}>
						<div className={styles.dashboard}>
							<div className={styles.dashboardHeader}>
								<div className={styles.tabs}>
									<button
										className={classNames(
											styles.tab,
											styles.active
										)}
									>
										Ссылки
									</button>
									<button className={styles.tab}>
										Аналитика
									</button>
									<button className={styles.tab}>Bio</button>
								</div>
							</div>

							<div className={styles.urlInput}>
								<input
									type='text'
									placeholder='Вставьте длинную ссылку...'
								/>
								<button>Сократить</button>
							</div>

							<div className={styles.linksTable}>
								<div className={styles.tableHeader}>
									<span>НАЗВАНИЕ / URL</span>
									<span>КЛИКИ</span>
									<span>СТАТУС</span>
									<span>ДЕЙСТВИЯ</span>
								</div>

								{links.map((link, index) => (
									<div
										key={index}
										className={styles.linkRow}
									>
										<div className={styles.linkInfo}>
											<p className={styles.linkTitle}>
												{link.title}
											</p>
											<p className={styles.linkSlug}>
												{link.slug}
											</p>
										</div>
										<div className={styles.linkClicks}>
											{link.clicks.toLocaleString()}
										</div>
										<div className={styles.linkStatus}>
											<span
												className={styles.statusBadge}
											>
												{link.status === 'active'
													? 'АКТИВНА'
													: ''}
											</span>
										</div>
										<div className={styles.linkActions}>
											<button aria-label='Копировать'>
												<Copy size={16} />
											</button>
											<button aria-label='Открыть'>
												<ExternalLink size={16} />
											</button>
											<button aria-label='Статистика'>
												<BarChart3 size={16} />
											</button>
										</div>
									</div>
								))}
							</div>

							<div className={styles.chart}>
								<div className={styles.chartHeader}>
									<span>Последняя активность</span>
									<a href='#analytics'>Полная аналитика →</a>
								</div>
								<ResponsiveContainer
									width='100%'
									height={150}
								>
									<LineChart
										data={chartData}
										margin={{
											top: 5,
											right: 5,
											left: 5,
											bottom: 5
										}}
									>
										<CartesianGrid
											strokeDasharray='3 3'
											stroke='var(--color-border)'
										/>
										<XAxis
											dataKey='name'
											stroke='var(--color-text-secondary)'
											fontSize={12}
											axisLine={false}
											tickLine={false}
										/>
										<YAxis hide />
										<Tooltip
											contentStyle={{
												backgroundColor:
													'var(--color-bg)',
												border: '1px solid var(--color-border)',
												borderRadius: '8px',
												color: 'var(--color-text-primary)'
											}}
										/>
										<Line
											type='monotone'
											dataKey='clicks'
											stroke='#4f46e5'
											strokeWidth={2}
											dot={{
												r: 4,
												fill: '#4f46e5',
												strokeWidth: 2,
												stroke: '#fff'
											}}
											activeDot={{
												r: 6,
												fill: '#4f46e5',
												stroke: '#fff',
												strokeWidth: 2
											}}
											animationDuration={2000}
											animationEasing='ease-out'
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>

							<div className={styles.qrBadge}>
								<div className={styles.qrIcon}>
									<QrCode size={24} />
								</div>
								<div>
									<p className={styles.qrTitle}>QR готов</p>
									<p className={styles.qrSubtitle}>
										Сканируйте мгновенно
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<DemoModal
				isOpen={isDemoModalOpen}
				onClose={() => setIsDemoModalOpen(false)}
			/>
		</section>
	)
}

export default Hero
