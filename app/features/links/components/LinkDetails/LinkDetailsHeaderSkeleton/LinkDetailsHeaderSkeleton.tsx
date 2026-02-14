import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import styles from './LinkDetailsHeaderSkeleton.module.scss'

export default function LinkDetailsHeaderSkeleton() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.card}>
				<div className={styles.info}>
					<div className={styles.infoHeader}>
						<Skeleton className={styles.title} />
						<Skeleton className={styles.badge} />
					</div>
					<div className={styles.infoBody}>
						<Skeleton className={styles.shortUrl} />
						<Skeleton className={styles.destination} />
					</div>
				</div>

				<div className={styles.actions}>
					<Skeleton className={styles.actionBtn} />
					<Skeleton className={styles.actionBtn} />
					<Skeleton className={styles.actionBtn} />
				</div>
			</div>

			<div className={styles.tabs}>
				<div className={styles.tab}>
					<Skeleton
						width={100}
						height={17}
						radius={7}
					/>
				</div>
				<div className={styles.tab}>
					<Skeleton
						width={100}
						height={17}
						radius={7}
					/>
				</div>
			</div>
		</div>
	)
}
