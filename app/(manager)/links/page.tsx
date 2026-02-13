'use client'

import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import LinksPageContent from '@/app/features/links/components/LinksPageContent/LinksPageContent'
import { useLinksPageController } from '@/hooks/links/useLinksPageController'

export default function LinksPage() {
	const {
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
	} = useLinksPageController()

	const { state, handlers } = manager

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
			<LinksPageContent
				manager={manager}
				availableTags={availableTags}
				isInitialLoading={isInitialLoading}
				isRefetching={isRefetching}
				isLoadingTags={isLoadingTags}
				loadError={loadError}
				clearLoadError={clearLoadError}
				filtersUiKey={filtersUiKey}
				canPauseBulk={canPauseBulk}
				canResumeBulk={canResumeBulk}
				canRestoreBulk={canRestoreBulk}
				canDeleteBulk={canDeleteBulk}
				emptyState={emptyState}
				resultsInfo={resultsInfo}
				modalConfig={modalConfig}
				handleEmptyStateClearFilters={handleEmptyStateClearFilters}
			/>
		</>
	)
}
