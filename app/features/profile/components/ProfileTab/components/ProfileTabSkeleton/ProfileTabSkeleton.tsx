import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import styles from './ProfileTabSkeleton.module.scss'

export default function ProfileTabSkeleton() {
	return (
		<div className={styles.root}>
			<div className={styles.avatarRow}>
				<Skeleton
					width={80}
					height={80}
					radius={50}
				/>
				<div className={styles.avatarMeta}>
					<Skeleton
						variant='text'
						width={220}
						height={14}
						radius={7}
					/>
					<Skeleton
						variant='text'
						width={180}
						height={12}
						radius={7}
					/>
					<Skeleton
						variant='text'
						width={120}
						height={12}
						radius={7}
					/>
				</div>
			</div>

			<div className={styles.fields}>
				<div className={styles.fieldsWrapper}>
					<div className={styles.field}>
						<Skeleton
							variant='text'
							width={140}
							height={15}
							radius={5}
						/>
						<Skeleton height={44} />
					</div>

					<div className={styles.field}>
						<Skeleton
							variant='text'
							width={170}
							height={15}
							radius={5}
						/>
						<Skeleton height={44} />
					</div>
				</div>
				<div className={styles.field}>
					<Skeleton
						variant='text'
						width={190}
						height={15}
						radius={5}
					/>
					<Skeleton height={44} />
				</div>
			</div>

			<div className={styles.notice}>
				<Skeleton
					width={180}
					height={15}
					radius={5}
				/>
			</div>
		</div>
	)
}
