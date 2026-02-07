import styles from './TabCard.module.scss'

interface TabCardProps {
	title: string
	subtitle: string
	children: React.ReactNode
}

export default function TabCard({ title, subtitle, children }: TabCardProps) {
	return (
		<div className={styles.card}>
			<div className={styles.cardHeader}>
				<h2 className={styles.cardTitle}>{title}</h2>
				<p className={styles.cardSubtitle}>{subtitle}</p>
			</div>
			<div className={styles.cardContent}>{children}</div>
		</div>
	)
}
