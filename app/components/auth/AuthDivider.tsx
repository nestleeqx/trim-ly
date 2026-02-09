import styles from './AuthShared.module.scss'

interface AuthDividerProps {
	text: string
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ text }) => {
	return (
		<div className={styles.divider}>
			<div className={styles.dividerLine} />
			<span className={styles.dividerText}>{text}</span>
			<div className={styles.dividerLine} />
		</div>
	)
}
