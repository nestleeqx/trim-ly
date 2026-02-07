'use client'

import { StatCard } from '../StatsCards/StatCard'
import styles from './LinkDetails.module.scss'
import { defaultLinkStatsData, LinkStatData, linkStatsConfig } from './linkStats.config'

interface LinkStatsCardsProps {
	data?: LinkStatData[]
}

export const LinkStatsCards: React.FC<LinkStatsCardsProps> = ({
	data = defaultLinkStatsData
}) => {
	return (
		<div className={styles.statsGrid}>
			{linkStatsConfig.map(config => {
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
						filterKey={config.id}
					/>
				)
			})}
		</div>
	)
}
