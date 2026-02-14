import styles from './LoadingOverlay.module.scss'

interface LoadingOverlayProps {
	className?: string
}

export default function LoadingOverlay({ className }: LoadingOverlayProps) {
	return (
		<div
			className={`${styles.loadingOverlay} ${className ?? ''}`.trim()}
			aria-hidden='true'
		>
			<div className={styles.linearLoader} />
			<div className={styles.spinner} />
		</div>
	)
}
