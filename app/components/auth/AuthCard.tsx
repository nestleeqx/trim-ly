import { ReactNode } from 'react'
import styles from './AuthShared.module.scss'

interface AuthCardProps {
	title: string
	subtitle: string
	children: ReactNode
}

export const AuthCard: React.FC<AuthCardProps> = ({
	title,
	subtitle,
	children
}) => {
	return (
		<div className={styles.card}>
			<div className={styles.cardHeader}>
				<h1 className={styles.cardTitle}>{title}</h1>
				<p className={styles.cardSubtitle}>{subtitle}</p>
			</div>
			{children}
		</div>
	)
}
