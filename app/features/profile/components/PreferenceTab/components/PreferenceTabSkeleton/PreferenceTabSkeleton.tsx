import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import styles from './PreferenceTabSkeleton.module.scss'

export default function PreferenceTabSkeleton() {
	return (
		<div className={styles.root}>
			<Skeleton
				variant='text'
				width={90}
				height={14}
				radius={5}
			/>

			<div className={styles.cards}>
				<div className={styles.card}>
					<Skeleton
						className={styles.rect}
						variant='rect'
						radius={14}
					/>
					<Skeleton
						className={styles.text}
						variant='text'
						radius={7}
					/>
				</div>

				<div className={styles.card}>
					<Skeleton
						className={styles.rect}
						variant='rect'
						radius={14}
					/>
					<Skeleton
						className={styles.text}
						variant='text'
						radius={7}
					/>
				</div>

				<div className={styles.card}>
					<Skeleton
						className={styles.rect}
						variant='rect'
						radius={14}
					/>
					<Skeleton
						className={styles.text}
						variant='text'
						radius={7}
					/>
				</div>
			</div>
		</div>
	)
}
