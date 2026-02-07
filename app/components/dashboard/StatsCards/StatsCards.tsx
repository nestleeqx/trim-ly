'use client'

import { StatCard } from './StatCard'
import { defaultStatsData, StatData, statsConfig } from './stats.config'
import styles from './StatsCards.module.scss'

interface StatsCardsProps {
	data?: StatData[]
}

const StatsCards: React.FC<StatsCardsProps> = ({ data = defaultStatsData }) => {
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
					/>
				)
			})}
		</div>
	)
}

export default StatsCards
