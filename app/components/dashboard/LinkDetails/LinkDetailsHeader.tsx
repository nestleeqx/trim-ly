'use client'

import styles from '@/app/(manager)/links/[id]/page.module.scss'
import LinkInfoCard from '@/app/components/ui/LinkInfoCard/LinkInfoCard'
import { LinkItem } from '@/types/links'
import React from 'react'

interface LinkDetailsHeaderProps {
	link: LinkItem
	linkId: string
	currentTab: string
	safeNavigate: (path: string) => void

	handlePauseItem: (id: string) => void
	handleResumeItem: (id: string) => void
	handleDeleteItem: (id: string) => void

	setShowQrModal: (show: boolean) => void
	handleCopy: (url: string) => void
	hideEditButton: boolean
}

export const LinkDetailsHeader: React.FC<LinkDetailsHeaderProps> = ({
	link,
	linkId,
	currentTab,
	safeNavigate,
	handlePauseItem,
	handleResumeItem,
	handleDeleteItem,
	setShowQrModal,
	handleCopy,
	hideEditButton
}) => {
	return (
		<>
			<LinkInfoCard
				link={link}
				onEdit={() => safeNavigate(`/links/${linkId}?tab=edit`)}
				onPause={() => handlePauseItem(linkId)}
				onResume={() => handleResumeItem(linkId)}
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
