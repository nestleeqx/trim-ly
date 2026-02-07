import { TrafficSource } from '../../sections/Analytics/analytics.config'
import styles from './TrafficBarChart.module.scss'

interface TrafficBarChartProps {
	sources: TrafficSource[]
}

const TrafficBarChart: React.FC<TrafficBarChartProps> = ({ sources }) => {
	return (
		<div className={styles.barChart}>
			{sources.map(source => (
				<div
					key={source.name}
					className={styles.barRow}
				>
					<span className={styles.barLabel}>{source.name}</span>
					<div className={styles.barTrack}>
						<div
							className={styles.barFill}
							style={{
								width: `${source.value}%`,
								backgroundColor: source.color
							}}
						/>
					</div>
				</div>
			))}
		</div>
	)
}

export default TrafficBarChart
