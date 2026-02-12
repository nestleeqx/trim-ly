'use client'

import NoticeBanner from '@/app/components/ui/NoticeBanner/NoticeBanner'
import TabCard from '../TabCard/TabCard'
import BillingContent from './components/BillingContent/BillingContent'
import BillingTabSkeleton from './components/BillingTabSkeleton/BillingTabSkeleton'
import useBillingTab from './hooks/useBillingTab'

export default function BillingTab() {
	const vm = useBillingTab()

	return (
		<TabCard
			title='Оплата'
			subtitle='Управляйте подпиской и способами оплаты.'
		>
			<>
				<NoticeBanner
					message={vm.error}
					type='error'
				/>
				{vm.isLoading && <BillingTabSkeleton />}
				{!vm.isLoading && vm.data && <BillingContent data={vm.data} />}
			</>
		</TabCard>
	)
}
