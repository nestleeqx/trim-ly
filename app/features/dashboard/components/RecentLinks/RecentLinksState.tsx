import { Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import styles from './RecentLinks.module.scss'

interface RecentLinksStateProps {
	title: string
	description: string
	ctaText?: string
	ctaHref?: string
	onRetry?: () => void
}

export default function RecentLinksState({
	title,
	description,
	ctaText,
	ctaHref,
	onRetry
}: RecentLinksStateProps) {
	return (
		<div className={styles.emptyState}>
			{ctaHref ? (
				<LinkIcon
					size={48}
					className={styles.emptyIcon}
				/>
			) : null}
			<h4 className={styles.emptyTitle}>{title}</h4>
			<p className={styles.emptyText}>{description}</p>
			{ctaText ? (
				ctaHref ? (
					<Link
						href={ctaHref}
						className={styles.emptyBtn}
					>
						<Plus size={18} />
						<span>{ctaText}</span>
					</Link>
				) : (
					<button
						type='button'
						className={styles.emptyBtn}
						onClick={onRetry}
					>
						{ctaText}
					</button>
				)
			) : null}
		</div>
	)
}
