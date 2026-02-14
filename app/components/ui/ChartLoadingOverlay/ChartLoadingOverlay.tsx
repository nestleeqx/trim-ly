import styles from './ChartLoadingOverlay.module.scss'

interface ChartLoadingOverlayProps {
	className?: string
}

export default function ChartLoadingOverlay({
	className
}: ChartLoadingOverlayProps) {
	return (
		<div
			className={`${styles.overlay} ${className ?? ''}`.trim()}
			aria-hidden='true'
		>
			<div className={styles.spinner} />
		</div>
	)
}
