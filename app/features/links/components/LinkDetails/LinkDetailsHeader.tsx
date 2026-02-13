'use client'

import styles from '@/app/(manager)/links/[id]/page.module.scss'
import LinkInfoCard from '@/app/features/links/components/LinkDetails/LinkInfoCard/LinkInfoCard'
import { LinkItem } from '@/types/links'

interface LinkDetailsHeaderProps {
	link: LinkItem
	linkId: string
	currentTab: string
	safeNavigate: (path: string) => void

	handlePauseItem: (id: string) => void
	handleResumeItem: (id: string) => void
	handleRestoreItem: (id: string) => void
	handleDeleteItem: (id: string) => void

	setShowQrModal: (show: boolean) => void
	handleCopy: (url: string) => void
	hideEditButton: boolean
}

export default function LinkDetailsHeader({
	link,
	linkId,
	currentTab,
	safeNavigate,
	handlePauseItem,
	handleResumeItem,
	handleRestoreItem,
	handleDeleteItem,
	setShowQrModal,
	handleCopy,
	hideEditButton
}: LinkDetailsHeaderProps) {
	return (
		<>
			<LinkInfoCard
				link={link}
				onEdit={() => safeNavigate(`/links/${linkId}?tab=edit`)}
				onPause={() => handlePauseItem(linkId)}
				onResume={() => handleResumeItem(linkId)}
				onRestore={() => handleRestoreItem(linkId)}
				onDelete={() => handleDeleteItem(linkId)}
				onDownloadQr={() => setShowQrModal(true)}
				onCopy={handleCopy}
				hideEditButton={hideEditButton}
			/>

			<div
				className={styles.tabs}
				role='tablist'
			>
				<button
					className={`${styles.tab} ${currentTab === 'analytics' ? styles.active : ''}`}
					onClick={() =>
						safeNavigate(`/links/${linkId}?tab=analytics`)
					}
					role='tab'
					aria-selected={currentTab === 'analytics'}
				>
					Аналитика
				</button>
				<button
					className={`${styles.tab} ${currentTab === 'edit' ? styles.active : ''}`}
					onClick={() => safeNavigate(`/links/${linkId}?tab=edit`)}
					role='tab'
					aria-selected={currentTab === 'edit'}
				>
					Редактирование
				</button>
			</div>
		</>
	)
}
