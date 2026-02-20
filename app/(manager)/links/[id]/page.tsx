'use client'

import styles from '@/app/(manager)/links/[id]/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'
import Button from '@/app/components/ui/Button/Button'
import LinkDetailsPageContent from '@/app/features/links/components/LinkDetails/LinkDetailsPageContent/LinkDetailsPageContent'
import LinkNotFound from '@/app/features/links/components/LinkNotFound/LinkNotFound'
import { useLinkDetailsPageController } from '@/app/features/links/hooks/useLinkDetailsPageController'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LinkDetailsPage() {
	const vm = useLinkDetailsPageController()
	if (vm.isNotFound) return <LinkNotFound />

	return (
		<>
			<DashboardHeader
				title='Детали ссылки'
				subtitle='Подробная информация о ссылке и её аналитика.'
				backHref='/links'
				hideBackButtonOnMobile
				showCreateButton={false}
				actions={
					<Link
						href='/links'
						className={styles.mobileBackAction}
					>
						<Button
							variant='ghost'
							size='sm'
						>
							<ArrowLeft size={16} />
							Назад
						</Button>
					</Link>
				}
			/>

			<div className={styles.content}>
				<LinkDetailsPageContent vm={vm} />
			</div>
		</>
	)
}
