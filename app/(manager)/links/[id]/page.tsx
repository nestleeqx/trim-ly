'use client'

import styles from '@/app/(manager)/links/[id]/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import LinkDetailsPageContent from '@/app/features/links/components/LinkDetails/LinkDetailsPageContent/LinkDetailsPageContent'
import LinkNotFound from '@/app/features/links/components/LinkNotFound/LinkNotFound'
import { useLinkDetailsPageController } from '@/hooks/links/useLinkDetailsPageController'

export default function LinkDetailsPage() {
	const vm = useLinkDetailsPageController()
	if (vm.isNotFound) return <LinkNotFound />

	return (
		<>
			<DashboardHeader
				title='Детали ссылки'
				subtitle='Подробная информация о ссылке и её аналитика.'
				backHref='/links'
				showCreateButton={false}
			/>

			<div className={styles.content}>
				<LinkDetailsPageContent vm={vm} />
			</div>
		</>
	)
}
