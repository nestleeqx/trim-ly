import cn from 'classnames'
import styles from './ChartLoadingOverlay.module.scss'

interface ChartLoadingOverlayProps {
	className?: string
}

export default function ChartLoadingOverlay({
	className
}: ChartLoadingOverlayProps) {
	return (
		<div
			className={cn(styles.overlay, className)}
			aria-hidden='true'
		>
			<div className={styles.spinner} />
		</div>
	)
}
