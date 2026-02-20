import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import styles from './BillingTabSkeleton.module.scss'

export default function BillingTabSkeleton() {
	return (
		<div className={styles.root}>
			<div className={styles.topGrid}>
				<div className={styles.card}>
					<div className={styles.cardHeader}>
						<div className={styles.cardHeaderLeft}>
							<Skeleton
								variant='text'
								width={120}
								height={12}
								radius={4}
							/>
							<Skeleton
								variant='text'
								width={150}
								height={22}
								radius={7}
							/>
						</div>
						<Skeleton
							variant='text'
							width={69}
							height={31}
							radius={20}
						/>
					</div>
					<Skeleton
						variant='rect'
						height={72}
						radius={12}
					/>
					<Skeleton
						variant='rect'
						width={170}
						height={40}
						radius={12}
					/>
				</div>
				<div className={styles.card}>
					<div className={styles.metric}>
						<div className={styles.metricHeader}>
							<Skeleton
								variant='text'
								width={130}
								height={15}
								radius={4}
							/>
							<Skeleton
								variant='text'
								width={36}
								height={15}
								radius={4}
							/>
						</div>
						<Skeleton
							variant='rect'
							height={8}
							radius={5}
						/>
					</div>

					<div className={styles.metric}>
						<div className={styles.metricHeader}>
							<Skeleton
								variant='text'
								width={130}
								height={15}
								radius={4}
							/>
							<Skeleton
								variant='text'
								width={36}
								height={15}
								radius={4}
							/>
						</div>
						<Skeleton
							variant='rect'
							height={8}
							radius={5}
						/>
					</div>
				</div>
			</div>

			<div className={styles.history}>
				<Skeleton
					variant='text'
					width={160}
					height={18}
					radius={4}
				/>
				<Skeleton
					variant='rect'
					height={160}
					radius={12}
				/>
			</div>
		</div>
	)
}
