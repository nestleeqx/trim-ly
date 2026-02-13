'use client'

import styles from '@/app/(manager)/links/page.module.scss'
import Toast from '@/app/components/ui/Toast/Toast'
import type { useLinksManager } from '@/hooks/useLinksManager'
import BulkActionsBar from '../BulkActionsBar/BulkActionsBar'
import ConfirmModal from '../ConfirmModal/ConfirmModal'
import LinksEmptyState from '../LinksEmptyState/LinksEmptyState'
import LinksFilters from '../LinksFilters/LinksFilters'
import LinksPageSkeleton from '../LinksPageSkeleton/LinksPageSkeleton'
import LinksResultsInfo from '../LinksResultsInfo/LinksResultsInfo'
import LinksViewContent from '../LinksViewContent/LinksViewContent'

type LinksManagerVm = ReturnType<typeof useLinksManager>

interface LinksPageContentProps {
	manager: LinksManagerVm
	availableTags: string[]
	isInitialLoading: boolean
	isRefetching: boolean
	isLoadingTags: boolean
	loadError: string | null
	clearLoadError: () => void
	filtersUiKey: number
	canPauseBulk: boolean
	canResumeBulk: boolean
	canRestoreBulk: boolean
	canDeleteBulk: boolean
	emptyState: {
		show: boolean
		hasLinks: boolean
		hasFilteredLinks: boolean
	}
	resultsInfo: {
		show: boolean
		totalFound: number
		searchQuery: string
	}
	modalConfig: {
		title: string
		message: string
		confirmText: string
		variant: 'danger' | 'warning'
	}
	handleEmptyStateClearFilters: () => void
}

export default function LinksPageContent({
	manager,
	availableTags,
	isInitialLoading,
	isRefetching,
	isLoadingTags,
	loadError,
	clearLoadError,
	filtersUiKey,
	canPauseBulk,
	canResumeBulk,
	canRestoreBulk,
	canDeleteBulk,
	emptyState,
	resultsInfo,
	modalConfig,
	handleEmptyStateClearFilters
}: LinksPageContentProps) {
	const { state, ui, handlers } = manager

	return (
		<>
			<div className={styles.content}>
				<LinksFilters
					key={filtersUiKey}
					onFiltersChange={handlers.handleFiltersChange}
					viewMode={state.viewMode}
					onViewModeChange={handlers.setViewMode}
					onExport={handlers.handleExport}
					exportLoading={ui.exportLoading}
					availableTags={availableTags}
					tagsLoading={isLoadingTags}
				/>

				<BulkActionsBar
					selectedCount={state.selectedLinks.length}
					onClearSelection={handlers.handleClearSelection}
					onPause={handlers.handleBulkPause}
					onResume={handlers.handleBulkResume}
					onRestore={handlers.handleBulkRestore}
					onDelete={handlers.handleBulkDelete}
					canPauseBulk={canPauseBulk}
					canResumeBulk={canResumeBulk}
					canRestoreBulk={canRestoreBulk}
					canDeleteBulk={canDeleteBulk}
				/>

				{isInitialLoading ? (
					<LinksPageSkeleton
						showFilters={false}
						showPagination={false}
					/>
				) : (
					<>
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
								hasActiveFilters={
									state.hasActiveFilters || isRefetching
								}
								isLoading={isRefetching}
								onClearFilters={handleEmptyStateClearFilters}
							/>
						) : (
							<LinksViewContent
								viewMode={state.viewMode}
								links={state.paginatedLinks}
								isRefetching={isRefetching}
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
								onRestore={handlers.handleRestoreItem}
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
					clearLoadError()
					handlers.hideToast()
				}}
				variant={loadError ? 'error' : ui.toast.variant}
			/>
		</>
	)
}
