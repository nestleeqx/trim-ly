import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import styles from './LinkEditViewSkeleton.module.scss'

export default function LinkEditViewSkeleton() {
	return (
		<div className={styles.layout}>
			<div className={styles.formCard}>
				<Skeleton className={styles.heading} />
				<Skeleton className={styles.field} />
				<Skeleton className={styles.field} />
				<Skeleton className={styles.field} />
				<Skeleton className={styles.field} />
				<div className={styles.actionButtons}>
					<Skeleton className={styles.actions} />
					<Skeleton className={styles.actions} />
				</div>
			</div>

			<div className={styles.previewCard}>
				<Skeleton className={styles.previewTitle} />
				<Skeleton className={styles.previewBlock} />
				<Skeleton className={styles.previewLine} />
				<Skeleton className={styles.previewLine} />
				<Skeleton className={styles.previewLine} />
			</div>
		</div>
	)
}
