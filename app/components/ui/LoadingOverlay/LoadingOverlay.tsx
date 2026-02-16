import cn from 'classnames'
import styles from './LoadingOverlay.module.scss'

interface LoadingOverlayProps {
	className?: string
}

export default function LoadingOverlay({ className }: LoadingOverlayProps) {
	return (
		<div
			className={cn(styles.loadingOverlay, className)}
			aria-hidden='true'
		>
			<div className={styles.linearLoader} />
			<div className={styles.spinner} />
		</div>
	)
}
