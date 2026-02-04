'use client'

import classNames from 'classnames'
import { BarChart3, Copy, ExternalLink, QrCode, X } from 'lucide-react'
import { useState } from 'react'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis
} from 'recharts'
import Toast from '../Toast'
import styles from './ProductPreview.module.scss'

const links = [
	{
		title: 'Запуск продукта',
		slug: 'trim.ly/launch-v2',
		clicks: 2453,
		status: 'active'
	},
	{
		title: 'Блог: Тренды 2026',
		slug: 'trim.ly/blog-trends',
		clicks: 1892,
		status: 'active'
	},
	{
		title: 'Промо-кампания',
		slug: 'trim.ly/sale-winter',
		clicks: 845,
		status: 'active'
	}
]

const chartData = [
	{ name: 'Пн', clicks: 120 },
	{ name: 'Вт', clicks: 190 },
	{ name: 'Ср', clicks: 150 },
	{ name: 'Чт', clicks: 280 },
	{ name: 'Пт', clicks: 220 },
	{ name: 'Сб', clicks: 340 },
	{ name: 'Вс', clicks: 290 }
]

export default function ProductPreview() {
	const [toast, setToast] = useState({ show: false, message: '' })
	const [showQrModal, setShowQrModal] = useState(false)
	const [activeTab, setActiveTab] = useState('links')
	const [inputValue, setInputValue] = useState('')

	const showToast = (message: string) => {
		setToast({ show: true, message })
	}

	const handleCopy = (slug: string) => {
		navigator.clipboard.writeText(`https://${slug}`)
		showToast('Скопировано!')
	}

	const scrollToAnalytics = () => {
		const element = document.getElementById('analytics')
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
		setActiveTab('analytics')
	}

	const handleShorten = () => {
		if (inputValue.trim()) {
			showToast('Ссылка создана!')
			setInputValue('')
		}
	}

	return (
		<div className={styles.right}>
			<Toast
				message={toast.message}
				isVisible={toast.show}
				onClose={() => setToast({ ...toast, show: false })}
			/>
			{showQrModal && (
				<div
					className={styles.qrModalOverlay}
					onClick={() => setShowQrModal(false)}
				>
					<div
						className={styles.qrModal}
						onClick={e => e.stopPropagation()}
					>
						<button
							className={styles.closeBtn}
							onClick={() => setShowQrModal(false)}
							aria-label='Закрыть'
						>
							<X size={20} />
						</button>
						<h3>QR-код ссылки</h3>
						<div className={styles.qrCode}>
							<div className={styles.qrPlaceholder}>
								<QrCode size={120} />
							</div>
						</div>
						<p>trim.ly/launch-v2</p>
						<button
							className={styles.downloadBtn}
							onClick={() => {
								showToast('QR-код сохранен!')
								setShowQrModal(false)
							}}
						>
							Скачать QR
						</button>
					</div>
				</div>
			)}

			<div className={styles.dashboard}>
				<div className={styles.dashboardHeader}>
					<div className={styles.tabs}>
						<button
							className={classNames(styles.tab, {
								[styles.active]: activeTab === 'links'
							})}
							onClick={() => setActiveTab('links')}
						>
							Ссылки
						</button>
						<button
							className={classNames(styles.tab, {
								[styles.active]: activeTab === 'analytics'
							})}
							onClick={scrollToAnalytics}
						>
							Аналитика
						</button>
						<button
							className={classNames(styles.tab, {
								[styles.active]: activeTab === 'bio'
							})}
							onClick={() => setActiveTab('bio')}
						>
							Bio
						</button>
					</div>
				</div>
				<div className={styles.urlInput}>
					<input
						type='text'
						placeholder='Вставьте длинную ссылку...'
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
					/>
					<button onClick={handleShorten}>Сократить</button>
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
								<p className={styles.linkTitle}>{link.title}</p>
								<p className={styles.linkSlug}>{link.slug}</p>
							</div>
							<div className={styles.linkClicks}>
								{link.clicks.toLocaleString()}
							</div>
							<div className={styles.linkStatus}>
								<span className={styles.statusBadge}>
									{link.status === 'active' ? 'АКТИВНА' : ''}
								</span>
							</div>
							<div className={styles.linkActions}>
								<button
									aria-label='Копировать'
									onClick={() => handleCopy(link.slug)}
									title='Копировать'
								>
									<Copy size={16} />
								</button>
								<button aria-label='Открыть'>
									<ExternalLink size={16} />
								</button>
								<button
									aria-label='Статистика'
									onClick={scrollToAnalytics}
									title='Аналитика'
								>
									<BarChart3 size={16} />
								</button>
							</div>
						</div>
					))}
				</div>

				<div className={styles.chart}>
					<div className={styles.chartHeader}>
						<span>Последняя активность</span>
						<a
							href='#analytics'
							onClick={e => {
								e.preventDefault()
								scrollToAnalytics()
							}}
						>
							Полная аналитика →
						</a>
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
									backgroundColor: 'var(--color-bg)',
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
				<div
					className={styles.qrBadge}
					onClick={() => setShowQrModal(true)}
					role='button'
					tabIndex={0}
				>
					<div className={styles.qrIcon}>
						<QrCode size={24} />
					</div>
					<div>
						<p className={styles.qrTitle}>QR готов</p>
						<p className={styles.qrSubtitle}>
							Нажмите для просмотра
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
