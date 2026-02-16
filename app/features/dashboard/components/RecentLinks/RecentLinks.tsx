'use client'

import Toast from '@/app/components/ui/Toast/Toast'
import ConfirmModal from '@/app/features/links/components/ConfirmModal/ConfirmModal'
import LinksPageSkeleton from '@/app/features/links/components/LinksPageSkeleton/LinksPageSkeleton'
import LinksTable from '@/app/features/links/components/LinksTable/LinksTable'
import styles from './RecentLinks.module.scss'
import RecentLinksEmpty from './RecentLinksEmpty'
import RecentLinksState from './RecentLinksState'
import useRecentLinksController, {
	RecentLinksProps
} from './useRecentLinksController'

export default function RecentLinks({
	links,
	isLoading,
	isEmpty,
	limit = 5
}: RecentLinksProps) {
	const vm = useRecentLinksController({
		links,
		isLoading,
		isEmpty,
		limit
	})

	if (vm.resolvedEmpty) {
		return <RecentLinksEmpty />
	}

	return (
		<div className={styles.card}>
			{vm.fetchError ? (
				<RecentLinksState
					title='Не удалось загрузить ссылки'
					description={vm.fetchError}
					ctaText='Повторить'
					onRetry={vm.handleRetry}
				/>
			) : vm.resolvedLoading ? (
				<LinksPageSkeleton
					rows={vm.limit}
					showFilters={false}
					showPagination={false}
					embedded
				/>
			) : (
				<LinksTable
					links={vm.links}
					selectedLinks={[]}
					onSelectAll={() => {}}
					onSelectLink={() => {}}
					onCopy={vm.handleCopy}
					onEdit={vm.handleEdit}
					onDelete={id => vm.openConfirm('delete', id)}
					onPause={id => vm.openConfirm('pause', id)}
					onResume={id => vm.openConfirm('resume', id)}
					onRestore={id => vm.openConfirm('restore', id)}
					allowSelection={false}
					showTrend={false}
					showActions
					title='Последние ссылки'
					allLinksHref='/links'
				/>
			)}

			<ConfirmModal
				isOpen={vm.confirmModal.isOpen}
				onClose={vm.closeConfirmModal}
				onConfirm={() => void vm.handleConfirmAction()}
				title={vm.confirmContent?.title ?? 'Подтверждение'}
				message={
					vm.confirmContent?.getMessage(vm.confirmModal.linkTitle) ??
					'Вы уверены?'
				}
				confirmText={vm.confirmContent?.confirmText ?? 'Подтвердить'}
				variant={vm.confirmContent?.variant ?? 'warning'}
				loading={vm.actionLoading}
			/>

			<Toast
				message={vm.toast.message}
				isVisible={vm.toast.isVisible}
				onClose={vm.hideToast}
				variant={vm.toast.variant}
			/>
		</div>
	)
}
