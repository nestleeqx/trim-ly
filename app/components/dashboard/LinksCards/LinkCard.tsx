'use client'

import { formatDate } from '@/app/utils/formatters'
import { getStatusLabel } from '@/app/utils/link-helpers'
import { LinkItem as LinkItemType } from '@/types/links'
import {
	BarChart3,
	Copy,
	ExternalLink,
	MoreVertical,
	QrCode
} from 'lucide-react'
import { KebabMenuActions } from '../LinksPage/KebabMenuActions/KebabMenuActions'
import sharedStyles from '../LinksPage/shared.module.scss'
import styles from './LinksCards.module.scss'

interface LinkCardProps {
	link: LinkItemType
	isSelected: boolean
	onSelectLink: (id: string, checked: boolean) => void
	openKebabId: string | null
	actions: {
		handleItemClick: (e: React.MouseEvent) => void
		handleCopy: (url: string, e?: React.MouseEvent) => void
		handleQrClick: (link: LinkItemType, e: React.MouseEvent) => void
		handleAnalyticsClick: (linkId: string, e: React.MouseEvent) => void
		handleKebabClick: (linkId: string, e: React.MouseEvent) => void
		closeKebabMenu: (e: React.MouseEvent) => void
		handleEdit: (linkId: string) => void
		handleToggleStatus: (link: LinkItemType) => void
		handleDelete: (linkId: string) => void
		handleTitleClick: (linkId: string, e: React.MouseEvent) => void
	}
}

export const LinkCard: React.FC<LinkCardProps> = ({
	link,
	isSelected,
	onSelectLink,
	openKebabId,
	actions
}) => {
	const getStatusClass = (status: LinkItemType['status']) => {
		const classes: Record<LinkItemType['status'], string> = {
			active: sharedStyles.active,
			paused: sharedStyles.paused,
			expired: sharedStyles.expired,
			deleted: sharedStyles.deleted
		}
		return classes[status]
	}

	return (
		<div
			className={`${styles.card} ${isSelected ? styles.selected : ''}`}
			onClick={e => actions.handleItemClick(e)}
		>
			<div className={styles.cardHeader}>
				<div className={styles.checkboxWrapper}>
					<input
						type='checkbox'
						checked={isSelected}
						onChange={e => onSelectLink(link.id, e.target.checked)}
						className={sharedStyles.checkbox}
						aria-label={`Выбрать ${link.title}`}
					/>
				</div>
				<span
					className={`${sharedStyles.status} ${getStatusClass(link.status)}`}
				>
					{getStatusLabel(link.status)}
				</span>
				<div className={styles.actions}>
					<div className={sharedStyles.kebabWrapper}>
						<button
							className={sharedStyles.actionBtn}
							onClick={e => actions.handleKebabClick(link.id, e)}
							title='Ещё'
						>
							<MoreVertical size={16} />
						</button>
						<KebabMenuActions
							link={link}
							openKebabId={openKebabId}
							actions={{
								closeKebabMenu: actions.closeKebabMenu,
								handleEdit: actions.handleEdit,
								handleToggleStatus: actions.handleToggleStatus,
								handleDelete: actions.handleDelete
							}}
						/>
					</div>
				</div>
			</div>
			<h3
				className={`${styles.cardTitle} ${styles.clickableCardTitle}`}
				onClick={e => actions.handleTitleClick(link.id, e)}
			>
				{link.title}
			</h3>
			<a
				href={`https://${link.shortUrl}`}
				target='_blank'
				rel='noopener noreferrer'
				className={sharedStyles.shortUrlLink}
			>
				<span className={sharedStyles.shortUrl}>{link.shortUrl}</span>
				<ExternalLink
					size={14}
					className={sharedStyles.externalIcon}
				/>
			</a>
			<div className={styles.stats}>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Клики</span>
					<span className={styles.statValue}>
						{link.clicks.toLocaleString()}
					</span>
				</div>
				<div className={styles.statItem}>
					<span className={styles.statLabel}>Создано</span>
					<span className={styles.statValue}>
						{formatDate(link.createdAt)}
					</span>
				</div>
			</div>
			<div className={styles.quickActions}>
				<button
					className={styles.quickActionBtn}
					onClick={e => actions.handleCopy(link.shortUrl, e)}
					title='Копировать'
				>
					<Copy size={16} />
					<span>Копировать</span>
				</button>
				<button
					className={styles.quickActionBtn}
					onClick={e => actions.handleQrClick(link, e)}
					title='QR код'
				>
					<QrCode size={16} />
					<span>QR</span>
				</button>
				<button
					className={styles.quickActionBtn}
					onClick={e => actions.handleAnalyticsClick(link.id, e)}
					title='Аналитика'
				>
					<BarChart3 size={16} />
					<span>Статистика</span>
				</button>
			</div>
		</div>
	)
}
