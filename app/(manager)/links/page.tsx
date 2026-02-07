'use client'

import BulkActionsBar from '@/app/components/dashboard/BulkActionsBar'
import DashboardHeader from '@/app/components/dashboard/DashboardHeader'
import LinksCards from '@/app/components/dashboard/LinksCards/LinksCards'
import LinksFilters from '@/app/components/dashboard/LinksFilters/LinksFilters'
import { LinksEmptyState } from '@/app/components/dashboard/LinksPage/LinksEmptyState'
import LinksTable from '@/app/components/dashboard/LinksTable/LinksTable'
import Pagination from '@/app/components/dashboard/Pagination/Pagination'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import Toast from '@/app/components/ui/Toast/Toast'
import { mockLinks } from '@/data/mockLinks'
import { useLinksManager } from '@/hooks/useLinksManager'
import { getModalConfig } from '@/types/links'
import styles from './page.module.scss'

export default function LinksPage() {
	const {
		links,
		paginatedLinks,
		selectedLinks,
		currentPage,
		totalPages,
		totalItems,
		itemsPerPage,
		viewMode,
		searchQuery,
		appliedSearch,
		exportLoading,
		confirmModal,
		actionLoading,
		toast,
		filteredAndSortedLinks,
		hasActiveFilters,
		setSearchQuery,
		setViewMode,
		handleSelectAll,
		handleSelectLink,
		handleClearSelection,
		handleSearch,
		handlePageChange,
		handleItemsPerPageChange,
		handleFiltersChange,
		handleClearFilters,
		handleCopyLink,
		handleDeleteItem,
		handlePauseItem,
		handleResumeItem,
		handleBulkPause,
		handleBulkResume,
		handleBulkDelete,
		handleCloseModal,
		handleConfirmAction,
		handleExport,
		hideToast
	} = useLinksManager(mockLinks)

	const selectedLinkItems = links.filter(link =>
		selectedLinks.includes(link.id)
	)

	const canPauseBulk =
		selectedLinkItems.length > 0 &&
		selectedLinkItems.every(link => link.status === 'active')

	const canResumeBulk =
		selectedLinkItems.length > 0 &&
		selectedLinkItems.every(link => link.status === 'paused')

	const modalConfig = getModalConfig(
		confirmModal.action,
		selectedLinks.length,
		confirmModal.itemTitle
	)

	return (
		<>
			<DashboardHeader
				title='Ссылки'
				subtitle='Управляйте и организуйте ваши короткие ссылки.'
				search={{
					value: searchQuery,
					onChange: setSearchQuery,
					onSearch: handleSearch,
					placeholder: 'Поиск по ссылкам...',
					autoSubmit: true
				}}
			/>

			<div className={styles.content}>
				<LinksFilters
					onFiltersChange={handleFiltersChange}
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					onExport={handleExport}
					exportLoading={exportLoading}
				/>

				<BulkActionsBar
					selectedCount={selectedLinks.length}
					onClearSelection={handleClearSelection}
					onPause={handleBulkPause}
					onResume={handleBulkResume}
					onDelete={handleBulkDelete}
					canPauseBulk={canPauseBulk}
					canResumeBulk={canResumeBulk}
				/>

				{filteredAndSortedLinks.length > 0 &&
					selectedLinks.length === 0 && (
						<div className={styles.resultsInfo}>
							<span>
								Найдено ссылок: {filteredAndSortedLinks.length}
							</span>
							{appliedSearch && (
								<span className={styles.searchInfo}>
									По запросу: &ldquo;{appliedSearch}&rdquo;
								</span>
							)}
						</div>
					)}

				{links.length === 0 || filteredAndSortedLinks.length === 0 ? (
					<LinksEmptyState
						hasLinks={links.length > 0}
						hasFilteredLinks={filteredAndSortedLinks.length > 0}
						hasActiveFilters={hasActiveFilters}
						onClearFilters={handleClearFilters}
					/>
				) : (
					<>
						{viewMode === 'list' ? (
							<LinksTable
								links={paginatedLinks}
								selectedLinks={selectedLinks}
								onSelectAll={handleSelectAll}
								onSelectLink={handleSelectLink}
								onCopy={handleCopyLink}
								onDelete={handleDeleteItem}
								onPause={handlePauseItem}
								onResume={handleResumeItem}
							/>
						) : (
							<LinksCards
								links={paginatedLinks}
								selectedLinks={selectedLinks}
								onSelectLink={handleSelectLink}
								onCopy={handleCopyLink}
								onDelete={handleDeleteItem}
								onPause={handlePauseItem}
								onResume={handleResumeItem}
							/>
						)}

						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							totalItems={totalItems}
							itemsPerPage={itemsPerPage}
							onPageChange={handlePageChange}
							onItemsPerPageChange={handleItemsPerPageChange}
						/>
					</>
				)}
			</div>

			<ConfirmModal
				isOpen={confirmModal.isOpen}
				onClose={handleCloseModal}
				onConfirm={handleConfirmAction}
				title={modalConfig.title}
				message={modalConfig.message}
				confirmText={modalConfig.confirmText}
				variant={modalConfig.variant}
				loading={actionLoading}
			/>

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
				variant={toast.variant}
			/>
		</>
	)
}
