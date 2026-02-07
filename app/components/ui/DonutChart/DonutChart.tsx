import { deviceLegend } from '../../sections/Analytics/analytics.config'
import styles from './DonutChart.module.scss'

interface DonutChartProps {
	mobilePercent: number
}

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const DonutChart: React.FC<DonutChartProps> = ({ mobilePercent }) => {
	const mobileStroke = (mobilePercent / 100) * CIRCUMFERENCE

	return (
		<div className={styles.donutSection}>
			<div className={styles.donut}>
				<svg
					viewBox='0 0 100 100'
					className={styles.donutSvg}
				>
					<circle
						cx='50'
						cy='50'
						r={RADIUS}
						fill='none'
						stroke='#e2e8f0'
						strokeWidth='12'
					/>
					<circle
						cx='50'
						cy='50'
						r={RADIUS}
						fill='none'
						stroke='#818cf8'
						strokeWidth='12'
						strokeDasharray={`${mobileStroke} ${CIRCUMFERENCE}`}
						strokeDashoffset={CIRCUMFERENCE * 0.25}
						strokeLinecap='round'
						style={{ transition: 'stroke-dasharray 0.5s ease' }}
					/>
				</svg>
				<div className={styles.donutCenter}>
					<span className={styles.donutValue}>{mobilePercent}%</span>
					<span className={styles.donutLabel}>MOBILE</span>
				</div>
			</div>
			<div className={styles.legend}>
				{deviceLegend.map(item => (
					<div
						key={item.label}
						className={styles.legendItem}
					>
						<span
							className={styles.legendDot}
							style={{ backgroundColor: item.color }}
						/>
						<span>{item.label}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default DonutChart
