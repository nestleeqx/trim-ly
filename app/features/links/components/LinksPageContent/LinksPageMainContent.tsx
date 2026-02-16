'use client'

import styles from '@/app/(manager)/links/page.module.scss'
import type { useLinksManager } from '@/app/features/links/hooks/useLinksManager'
import BulkActionsBar from '../BulkActionsBar/BulkActionsBar'
import LinksEmptyState from '../LinksEmptyState/LinksEmptyState'
import LinksFilters from '../LinksFilters/LinksFilters'
import LinksPageSkeleton from '../LinksPageSkeleton/LinksPageSkeleton'
import LinksResultsInfo from '../LinksResultsInfo/LinksResultsInfo'
import LinksViewContent from '../LinksViewContent/LinksViewContent'

type LinksManagerVm = ReturnType<typeof useLinksManager>

interface LinksPageMainContentProps {
	manager: LinksManagerVm
	availableTags: string[]
	isInitialLoading: boolean
	isRefetching: boolean
	isLoadingTags: boolean
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
	handleEmptyStateClearFilters: () => void
}

export default function LinksPageMainContent({
	manager,
	availableTags,
	isInitialLoading,
	isRefetching,
	isLoadingTags,
	filtersUiKey,
	canPauseBulk,
	canResumeBulk,
	canRestoreBulk,
	canDeleteBulk,
	emptyState,
	resultsInfo,
	handleEmptyStateClearFilters
}: LinksPageMainContentProps) {
	const { state, ui, handlers } = manager

	return (
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
					{resultsInfo.show ? (
						<LinksResultsInfo
							totalFound={resultsInfo.totalFound}
							searchQuery={resultsInfo.searchQuery}
						/>
					) : null}

					{emptyState.show ? (
						<LinksEmptyState
							hasLinks={emptyState.hasLinks}
							hasFilteredLinks={emptyState.hasFilteredLinks}
							hasActiveFilters={state.hasActiveFilters || isRefetching}
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
							onItemsPerPageChange={handlers.handleItemsPerPageChange}
						/>
					)}
				</>
			)}
		</div>
	)
}
