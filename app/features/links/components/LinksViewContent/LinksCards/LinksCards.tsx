'use client'

import { useLinkActions } from '@/hooks/useLinkActions'
import { LinkItem as LinkItemType } from '@/types/links'
import QrCodeModal from '../../QrCodeModal/QrCodeModal'
import LinkCard from './LinkCard/LinkCard'
import styles from './LinksCards.module.scss'

interface LinksCardsProps {
	links: LinkItemType[]
	selectedLinks: string[]
	onSelectLink: (id: string, checked: boolean) => void
	onCopy?: (shortUrl: string) => void
	onDelete?: (id: string) => void
	onPause?: (id: string) => void
	onResume?: (id: string) => void
	onRestore?: (id: string) => void
}

export default function LinksCards({
	links,
	selectedLinks,
	onSelectLink,
	onCopy,
	onDelete,
	onPause,
	onResume,
	onRestore
}: LinksCardsProps) {
	const actions = useLinkActions({
		onCopy,
		onDelete,
		onPause,
		onResume,
		onRestore
	})

	return (
		<>
			<div className={styles.cardsGrid}>
				{links.map(link => (
					<LinkCard
						key={link.id}
						link={link}
						isSelected={selectedLinks.includes(link.id)}
						onSelectLink={onSelectLink}
						openKebabId={actions.openKebabId}
						actions={actions}
					/>
				))}
			</div>

			{actions.qrModalLink && (
				<QrCodeModal
					link={actions.qrModalLink}
					onClose={actions.closeQrModal}
					onCopyUrl={actions.handleCopyQrUrl}
					onDownload={actions.handleDownloadQr}
				/>
			)}
		</>
	)
}
