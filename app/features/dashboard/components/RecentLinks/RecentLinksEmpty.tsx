import styles from './RecentLinks.module.scss'
import RecentLinksState from './RecentLinksState'

export default function RecentLinksEmpty() {
	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h3 className={styles.title}>Последние ссылки</h3>
			</div>
			<RecentLinksState
				title='Нет ссылок'
				description='Создайте свою первую короткую ссылку'
				ctaText='Создать ссылку'
				ctaHref='/links/new'
			/>
		</div>
	)
}
