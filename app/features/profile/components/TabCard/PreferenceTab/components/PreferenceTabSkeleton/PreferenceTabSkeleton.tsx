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
						variant='rect'
						width={220}
						height={119}
						radius={14}
					/>
					<Skeleton
						variant='text'
						width={56}
						height={12}
						radius={7}
					/>
				</div>

				<div className={styles.card}>
					<Skeleton
						variant='rect'
						width={220}
						height={119}
						radius={14}
					/>
					<Skeleton
						variant='text'
						width={48}
						height={12}
						radius={7}
					/>
				</div>

				<div className={styles.card}>
					<Skeleton
						variant='rect'
						width={220}
						height={119}
						radius={14}
					/>
					<Skeleton
						variant='text'
						width={62}
						height={12}
						radius={7}
					/>
				</div>
			</div>
		</div>
	)
}
