import styles from './RecentLinks.module.scss'

interface RecentLinksSkeletonProps {
	count?: number
}

const SkeletonRow: React.FC = () => (
	<tr className={styles.skeletonRow}>
		<td>
			<div className={styles.skeletonTitle}>
				<div
					className={`${styles.skeleton} ${styles.skeletonTextLg}`}
				/>
			</div>
		</td>
		<td>
			<div
				className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextMd}`}
			/>
		</td>
		<td>
			<div
				className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextSm}`}
			/>
		</td>
		<td>
			<div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
		</td>
		<td>
			<div
				className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextMd}`}
			/>
		</td>
		<td>
			<div className={styles.skeletonActions}>
				{[1, 2, 3, 4].map(i => (
					<div
						key={i}
						className={`${styles.skeleton} ${styles.skeletonAction}`}
					/>
				))}
			</div>
		</td>
	</tr>
)

export default function RecentLinksSkeleton({
	count = 5
}: RecentLinksSkeletonProps) {
	return (
		<>
			{Array.from({ length: count }, (_, i) => (
				<SkeletonRow key={i} />
			))}
		</>
	)
}
