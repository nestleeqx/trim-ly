'use client'

import styles from '@/app/(manager)/links/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Toast from '@/app/components/ui/Toast/Toast'
import { getLinks, mapCreateLinkError } from '@/app/features/links/api/linksApi'
import BulkActionsBar from '@/app/features/links/components/BulkActionsBar/BulkActionsBar'
import ConfirmModal from '@/app/features/links/components/ConfirmModal/ConfirmModal'
import LinksEmptyState from '@/app/features/links/components/LinksEmptyState/LinksEmptyState'
import LinksFilters from '@/app/features/links/components/LinksFilters/LinksFilters'
import LinksPageSkeleton from '@/app/features/links/components/LinksPageSkeleton/LinksPageSkeleton'
import LinksResultsInfo from '@/app/features/links/components/LinksResultsInfo/LinksResultsInfo'
import LinksViewContent from '@/app/features/links/components/LinksViewContent/LinksViewContent'
import { useLinksManager } from '@/hooks/useLinksManager'
import { LinkItem } from '@/types/links'
import {
	calculateBulkCapabilities,
	getConfirmModalConfig,
	getEmptyStateData,
	getResultsInfo,
	getSelectedLinkItems
} from '@/utils/link-helpers'
import { useEffect, useState } from 'react'

export default function LinksPage() {
	const [loadedLinks, setLoadedLinks] = useState<LinkItem[]>([])
	const [isLoadingLinks, setIsLoadingLinks] = useState(true)
	const [loadError, setLoadError] = useState<string | null>(null)

	useEffect(() => {
		let active = true

		const load = async () => {
			setIsLoadingLinks(true)
			setLoadError(null)

			try {
				const items = await getLinks()
				if (!active) return

				setLoadedLinks(
					items.map(link => ({
						id: link.id,
						title: link.title,
						shortUrl: link.shortUrl,
						destination: link.destination,
						clicks: link.clicks,
						status: link.status,
						tags: link.tags,
						createdAt: new Date(link.createdAt),
						expirationDate: link.expirationDate
							? new Date(link.expirationDate)
							: undefined,
						hasPassword: link.hasPassword
					}))
				)
			} catch (error) {
				if (!active) return
				setLoadError(
					error instanceof Error
						? mapCreateLinkError(error.message)
						: 'Не удалось загрузить ссылки.'
				)
				setLoadedLinks([])
			} finally {
				if (active) setIsLoadingLinks(false)
			}
		}

		void load()

		return () => {
			active = false
		}
	}, [])

	const manager = useLinksManager(loadedLinks)
	const { state, ui, handlers } = manager

	const selectedItems = getSelectedLinkItems(state.links, state.selectedLinks)
	const { canPauseBulk, canResumeBulk } =
		calculateBulkCapabilities(selectedItems)
	const emptyState = getEmptyStateData(
		state.links.length,
		state.filteredAndSortedLinks.length
	)
	const resultsInfo = getResultsInfo(
		state.filteredAndSortedLinks.length,
		state.selectedLinks.length,
		state.appliedSearch
	)
	const modalConfig = getConfirmModalConfig(
		ui.confirmModal.action as string,
		state.selectedLinks.length,
		ui.confirmModal.itemTitle
	)

	return (
		<>
			<DashboardHeader
				title='Ссылки'
				subtitle='Управляйте и организуйте ваши короткие ссылки.'
				search={{
					value: state.searchQuery,
					onChange: handlers.setSearchQuery,
					onSearch: handlers.handleSearch,
					placeholder: 'Поиск по ссылкам...',
					autoSubmit: true
				}}
			/>

			<div className={styles.content}>
				{isLoadingLinks ? (
					<LinksPageSkeleton />
				) : (
					<>
						<LinksFilters
							onFiltersChange={handlers.handleFiltersChange}
							viewMode={state.viewMode}
							onViewModeChange={handlers.setViewMode}
							onExport={handlers.handleExport}
							exportLoading={ui.exportLoading}
						/>

						<BulkActionsBar
							selectedCount={state.selectedLinks.length}
							onClearSelection={handlers.handleClearSelection}
							onPause={handlers.handleBulkPause}
							onResume={handlers.handleBulkResume}
							onDelete={handlers.handleBulkDelete}
							canPauseBulk={canPauseBulk}
							canResumeBulk={canResumeBulk}
						/>

						{resultsInfo.show && (
							<LinksResultsInfo
								totalFound={resultsInfo.totalFound}
								searchQuery={resultsInfo.searchQuery}
							/>
						)}

						{emptyState.show ? (
							<LinksEmptyState
								hasLinks={emptyState.hasLinks}
								hasFilteredLinks={emptyState.hasFilteredLinks}
								hasActiveFilters={state.hasActiveFilters}
								onClearFilters={handlers.handleClearFilters}
							/>
						) : (
							<LinksViewContent
								viewMode={state.viewMode}
								links={state.paginatedLinks}
								selectedLinks={state.selectedLinks}
								currentPage={state.currentPage}
								totalPages={state.totalPages}
								totalItems={state.totalItems}
								itemsPerPage={state.itemsPerPage}
								onSelectAll={handlers.handleSelectAll}
								onSelectLink={handlers.handleSelectLink}
								onCopy={handlers.handleCopyLink}
								onDelete={handlers.handleDeleteItem}
								onPause={handlers.handlePauseItem}
								onResume={handlers.handleResumeItem}
								onPageChange={handlers.handlePageChange}
								onItemsPerPageChange={
									handlers.handleItemsPerPageChange
								}
							/>
						)}
					</>
				)}
			</div>

			<ConfirmModal
				isOpen={ui.confirmModal.isOpen}
				onClose={handlers.handleCloseModal}
				onConfirm={handlers.handleConfirmAction}
				title={modalConfig.title}
				message={modalConfig.message}
				confirmText={modalConfig.confirmText}
				variant={modalConfig.variant}
				loading={ui.actionLoading}
			/>

			<Toast
				message={loadError || ui.toast.message}
				isVisible={Boolean(loadError) || ui.toast.isVisible}
				onClose={() => {
					setLoadError(null)
					handlers.hideToast()
				}}
				variant={loadError ? 'error' : ui.toast.variant}
			/>
		</>
	)
}
