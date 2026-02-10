import styles from '@/app/(manager)/links/[id]/page.module.scss'
import DashboardHeader from '@/app/components/layout/DashboardHeader/DashboardHeader'

export default function LinkNotFound() {
	return (
		<>
			<DashboardHeader
				title='Ссылка не найдена'
				backHref='/links'
				showCreateButton={false}
			/>
			<div className={styles.content}>
				<p>Запрашиваемая ссылка не существует или была удалена.</p>
			</div>
		</>
	)
}
