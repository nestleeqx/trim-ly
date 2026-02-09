import styles from '@/app/(manager)/links/[id]/page.module.scss'
import DashboardHeader from '../../ui/DashboardHeader'

const LinkNotFound: React.FC = () => {
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

export default LinkNotFound
