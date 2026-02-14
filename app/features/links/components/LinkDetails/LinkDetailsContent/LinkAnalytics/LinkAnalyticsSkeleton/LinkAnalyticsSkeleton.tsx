import Skeleton from '@/app/components/ui/Skeleton/Skeleton'
import LinksPageSkeleton from '@/app/features/links/components/LinksPageSkeleton/LinksPageSkeleton'
import styles from './LinkAnalyticsSkeleton.module.scss'

export default function LinkAnalyticsSkeleton() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.statsGrid}>
				<div className={styles.statsCard}>
					<div className={styles.statCardHeader}>
						<Skeleton
							width={45}
							height={45}
							radius={12}
						/>
						<Skeleton
							width={45}
							height={30}
						/>
					</div>
					<Skeleton
						className={styles.statCardTitle}
						width={50}
						height={30}
					/>
					<Skeleton
						width={150}
						height={20}
					/>
				</div>
				<div className={styles.statsCard}>
					<div className={styles.statCardHeader}>
						<Skeleton
							width={45}
							height={45}
							radius={12}
						/>
						<Skeleton
							width={45}
							height={30}
						/>
					</div>
					<Skeleton
						className={styles.statCardTitle}
						width={50}
						height={30}
					/>
					<Skeleton
						width={150}
						height={20}
					/>
				</div>
				<div className={styles.statsCard}>
					<div className={styles.statCardHeader}>
						<Skeleton
							width={45}
							height={45}
							radius={12}
						/>
						<Skeleton
							width={45}
							height={30}
						/>
					</div>
					<Skeleton
						className={styles.statCardTitle}
						width={50}
						height={30}
					/>
					<Skeleton
						width={150}
						height={20}
					/>
				</div>
				<div className={styles.statsCard}>
					<div className={styles.statCardHeader}>
						<Skeleton
							width={45}
							height={45}
							radius={12}
						/>
						<Skeleton
							width={45}
							height={30}
						/>
					</div>
					<Skeleton
						className={styles.statCardTitle}
						width={50}
						height={30}
					/>
					<Skeleton
						width={150}
						height={20}
					/>
				</div>
			</div>

			<div className={styles.chartCard}>
				<div className={styles.chartCardHeader}>
					<div>
						<Skeleton
							className={styles.chartCardTitle}
							width={200}
							height={30}
						/>
						<Skeleton
							width={120}
							height={30}
						/>
					</div>
					<Skeleton
						width={200}
						height={30}
					/>
				</div>
				<Skeleton className={styles.chartContent} />
				<div className={styles.chartContentDetails}>
					<Skeleton
						width={50}
						height={30}
					/>
					<Skeleton
						width={50}
						height={30}
					/>
				</div>
			</div>

			<div className={styles.sideCharts}>
				<div className={styles.sideCard}>
					<Skeleton
						width={170}
						height={30}
					/>
					<div className={styles.sideCardContent}>
						<Skeleton
							width={200}
							height={20}
						/>
						<Skeleton
							width={200}
							height={20}
						/>
						<Skeleton
							width={200}
							height={20}
						/>
					</div>
				</div>
				<div className={styles.sideCard}>
					<Skeleton
						width={170}
						height={30}
					/>
					<div className={styles.sideCardContent}>
						<Skeleton
							width={200}
							height={20}
						/>
						<Skeleton
							width={200}
							height={20}
						/>
						<Skeleton
							width={200}
							height={20}
						/>
					</div>
				</div>
				<div className={styles.sideCard}>
					<Skeleton
						width={170}
						height={30}
					/>
					<div className={styles.sideCardContent}>
						<Skeleton
							width={200}
							height={20}
						/>
						<Skeleton
							width={200}
							height={20}
						/>
						<Skeleton
							width={200}
							height={20}
						/>
					</div>
				</div>
			</div>

			<div className={styles.tableSkeleton}>
				<LinksPageSkeleton
					rows={6}
					showFilters={false}
					showPagination
					embedded
				/>
			</div>
		</div>
	)
}
