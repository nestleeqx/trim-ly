'use client'

import type { useLinksManager } from '@/app/features/links/hooks/useLinksManager'
import LinksPageMainContent from './LinksPageMainContent'
import LinksPageOverlays from './LinksPageOverlays'

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
	isClearingFilters: boolean
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
	isClearingFilters,
	canPauseBulk,
	canResumeBulk,
	canRestoreBulk,
	canDeleteBulk,
	emptyState,
	resultsInfo,
	modalConfig,
	handleEmptyStateClearFilters
}: LinksPageContentProps) {
	return (
		<>
			<LinksPageMainContent
				manager={manager}
				availableTags={availableTags}
				isInitialLoading={isInitialLoading}
				isRefetching={isRefetching}
				isLoadingTags={isLoadingTags}
				filtersUiKey={filtersUiKey}
				isClearingFilters={isClearingFilters}
				canPauseBulk={canPauseBulk}
				canResumeBulk={canResumeBulk}
				canRestoreBulk={canRestoreBulk}
				canDeleteBulk={canDeleteBulk}
				emptyState={emptyState}
				resultsInfo={resultsInfo}
				handleEmptyStateClearFilters={handleEmptyStateClearFilters}
			/>
			<LinksPageOverlays
				manager={manager}
				loadError={loadError}
				clearLoadError={clearLoadError}
				modalConfig={modalConfig}
			/>
		</>
	)
}
