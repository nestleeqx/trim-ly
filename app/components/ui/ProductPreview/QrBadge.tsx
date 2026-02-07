import { QrCode } from 'lucide-react'
import styles from './ProductPreview.module.scss'

interface QrBadgeProps {
	onClick: () => void
}

export const QrBadge: React.FC<QrBadgeProps> = ({ onClick }) => {
	return (
		<div
			className={styles.qrBadge}
			onClick={onClick}
			role='button'
			tabIndex={0}
		>
			<div className={styles.qrIcon}>
				<QrCode size={24} />
			</div>
			<div>
				<p className={styles.qrTitle}>QR готов</p>
				<p className={styles.qrSubtitle}>Нажмите для просмотра</p>
			</div>
		</div>
	)
}
