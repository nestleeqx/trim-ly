'use client'

import LinksFilters from '@/app/components/dashboard/LinksFilters/LinksFilters'
import BulkActionsBar from '@/app/components/ui/BulkActionsBar'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import DashboardHeader from '@/app/components/ui/DashboardHeader'
import { LinksEmptyState } from '@/app/components/ui/LinksEmpyState/LinksEmptyState'
import Toast from '@/app/components/ui/Toast/Toast'
import {
	calculateBulkCapabilities,
	getConfirmModalConfig,
	getEmptyStateData,
	getResultsInfo,
	getSelectedLinkItems
} from '@/app/utils/link-helpers'
import { mockLinks } from '@/data/mockLinks'
import { useLinksManager } from '@/hooks/useLinksManager'
import LinksResultsInfo from '../../components/ui/LinksResultsInfo'
import LinksViewContent from '../../components/ui/LinksViewContent'
import styles from './page.module.scss'

export default function LinksPage() {
	const manager = useLinksManager(mockLinks)
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
						onItemsPerPageChange={handlers.handleItemsPerPageChange}
					/>
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
				message={ui.toast.message}
				isVisible={ui.toast.isVisible}
				onClose={handlers.hideToast}
				variant={ui.toast.variant}
			/>
		</>
	)
}
