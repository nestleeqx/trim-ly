'use client'

import StatCard from '../StatCard/StatCard'
import { defaultStatsData, StatData, statsConfig } from './stats.config'
import styles from './StatsCards.module.scss'

interface StatsCardsProps {
	data?: StatData[]
	clickable?: boolean
}

export default function StatsCards({
	data = defaultStatsData,
	clickable = true
}: StatsCardsProps) {
	return (
		<div className={styles.grid}>
			{statsConfig.map(config => {
				const statData = data.find(d => d.id === config.id)
				if (!statData) return null

				return (
					<StatCard
						key={config.id}
						icon={config.icon}
						value={statData.value}
						label={config.label}
						change={statData.change}
						iconBgColor={config.iconBgColor}
						filterKey={config.filterKey}
						clickable={clickable}
					/>
				)
			})}
		</div>
	)
}
