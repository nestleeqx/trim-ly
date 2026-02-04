'use client'

import {
	Link as LinkIcon,
	MousePointerClick,
	QrCode,
	TrendingUp
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import styles from './StatsCards.module.scss'

interface StatCard {
	icon: React.ReactNode
	value: string
	label: string
	change: number
	iconBgColor: string
	filterKey: string
}

const stats: StatCard[] = [
	{
		icon: <MousePointerClick size={20} />,
		value: '12 842',
		label: 'Всего кликов (7д)',
		change: 12.4,
		iconBgColor: '#eef2ff',
		filterKey: 'clicks'
	},
	{
		icon: <LinkIcon size={20} />,
		value: '48',
		label: 'Активных ссылок',
		change: 2.1,
		iconBgColor: '#f0fdf4',
		filterKey: 'links'
	},
	{
		icon: <TrendingUp size={20} />,
		value: '4 102',
		label: 'Топ клики по ссылке',
		change: 8.5,
		iconBgColor: '#eff6ff',
		filterKey: 'top'
	},
	{
		icon: <QrCode size={20} />,
		value: '854',
		label: 'QR сканирований',
		change: -4.2,
		iconBgColor: '#faf5ff',
		filterKey: 'qr'
	}
]

const StatsCards: React.FC = () => {
	const router = useRouter()

	const handleCardClick = (filterKey: string) => {
		router.push(`/analytics?filter=${filterKey}`)
	}

	return (
		<div className={styles.grid}>
			{stats.map((stat, index) => (
				<div
					key={index}
					className={styles.card}
					onClick={() => handleCardClick(stat.filterKey)}
					role='button'
					tabIndex={0}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ' ') {
							handleCardClick(stat.filterKey)
						}
					}}
					aria-label={`${stat.label}: ${stat.value}. Нажмите для просмотра деталей`}
				>
					<div className={styles.header}>
						<div
							className={styles.iconWrapper}
							style={{ backgroundColor: stat.iconBgColor }}
						>
							{stat.icon}
						</div>
						<span
							className={`${styles.change} ${stat.change >= 0 ? styles.positive : styles.negative}`}
						>
							{stat.change >= 0 ? '+' : ''}
							{stat.change}%
						</span>
					</div>
					<div className={styles.content}>
						<span className={styles.value}>{stat.value}</span>
						<span className={styles.label}>{stat.label}</span>
					</div>
				</div>
			))}
		</div>
	)
}

export default StatsCards
