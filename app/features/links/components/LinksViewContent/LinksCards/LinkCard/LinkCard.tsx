'use client'

import sharedStyles from '@/app/features/links/components/LinksTable/shared.module.scss'
import { LinkItem as LinkItemType } from '@/types/links'
import { formatDate } from '@/utils/formatters'
import { getStatusLabel } from '@/utils/link-helpers'
import { ExternalLink, MoreVertical } from 'lucide-react'
import KebabMenuActions from '../../../KebabMenuActions/KebabMenuActions'
import LinkActions from '../../../LinksTable/LinkTableRow'
import { getStatusClass } from '../../../LinksTable/shared'
import styles from './LinkCard.module.scss'
import QuickButtons from './QuickButtons'

interface LinkCardProps {
	link: LinkItemType
	isSelected: boolean
	onSelectLink: (id: string, checked: boolean) => void
	openKebabId: string | null
	actions: LinkActions
}

const stop = (e: React.SyntheticEvent) => e.stopPropagation()

export default function LinkCard({
	link,
	isSelected,
	onSelectLink,
	openKebabId,
	actions
}: LinkCardProps) {
	const href = `https://${link.shortUrl}`

	return (
		<div
			className={`${styles.card} ${isSelected ? styles.selected : ''}`}
			onClick={actions.handleItemClick}
		>
			<div className={styles.cardHeader}>
				<div className={styles.checkboxWrapper}>
					<input
						type='checkbox'
						checked={isSelected}
						className={sharedStyles.checkbox}
						aria-label={`Выбрать ${link.title}`}
						onClick={stop}
						onChange={e => onSelectLink(link.id, e.target.checked)}
					/>
				</div>

				<span
					className={`${sharedStyles.status} ${getStatusClass(link.status)}`}
				>
					{getStatusLabel(link.status)}
				</span>

				<div className={styles.kebabActions}>
					<div className={sharedStyles.kebabWrapper}>
						<button
							type='button'
							className={sharedStyles.actionBtn}
							title='Ещё'
							onClick={e => actions.handleKebabClick(link.id, e)}
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
				className={styles.cardTitle}
				onClick={e => actions.handleTitleClick(link.id, e)}
			>
				{link.title}
			</h3>

			<a
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				className={sharedStyles.shortUrlLink}
				onClick={stop}
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

			<QuickButtons
				stop={stop}
				link={link}
				actions={{
					handleCopy: actions.handleCopy,
					handleQrClick: actions.handleQrClick,
					handleAnalyticsClick: actions.handleAnalyticsClick
				}}
			/>
		</div>
	)
}
