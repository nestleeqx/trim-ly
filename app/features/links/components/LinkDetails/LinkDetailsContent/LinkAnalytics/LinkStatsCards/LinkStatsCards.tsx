'use client'

import StatCard from '@/app/features/analytics/components/StatCard/StatCard'
import styles from './LinkStatsCards.module.scss'
import {
	defaultLinkStatsData,
	LinkStatData,
	linkStatsConfig
} from './linkStats.config'

interface LinkStatsCardsProps {
	data?: LinkStatData[]
}

export default function LinkStatsCards({
	data = defaultLinkStatsData
}: LinkStatsCardsProps) {
	return (
		<div className={styles.statsGrid}>
			{linkStatsConfig.map(config => {
				const statData = data.find(d => d.id === config.id)
				if (!statData) return null
				const value = statData.value?.trim()
					? statData.value
					: config.id === 'topCountry'
						? 'Нет данных'
						: '0'

				return (
					<StatCard
						key={config.id}
						icon={config.icon}
						value={value}
						label={config.label}
						change={statData.change}
						filterKey={config.id}
					/>
				)
			})}
		</div>
	)
}
