'use client'

import sharedStyles from '@/app/features/links/components/LinksTable/shared.module.scss'
import { toShortLinkHref } from '@/app/features/links/utils/shortLink'
import { LinkItem as LinkItemType } from '@/types/links'
import cn from 'classnames'
import { ExternalLink } from 'lucide-react'
import { LinkActions } from '../../../LinksTable/LinkTableRow/types'
import styles from './LinkCard.module.scss'
import LinkCardHeader from './LinkCardHeader'
import LinkCardStats from './LinkCardStats'
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
	const href = toShortLinkHref(link.shortUrl)

	return (
		<div
			className={cn(styles.card, {
				[styles.selected]: isSelected
			})}
			onClick={actions.handleItemClick}
		>
			<LinkCardHeader
				link={link}
				isSelected={isSelected}
				openKebabId={openKebabId}
				onSelectLink={onSelectLink}
				stop={stop}
				actions={actions}
			/>

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

			<LinkCardStats link={link} />

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
