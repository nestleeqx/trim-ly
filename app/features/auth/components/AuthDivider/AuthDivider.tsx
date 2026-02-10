import styles from './AuthDivider.module.scss'

interface AuthDividerProps {
	text: string
}

export default function AuthDivider({ text }: AuthDividerProps) {
	return (
		<div className={styles.divider}>
			<div className={styles.dividerLine} />
			<span className={styles.dividerText}>{text}</span>
			<div className={styles.dividerLine} />
		</div>
	)
}
