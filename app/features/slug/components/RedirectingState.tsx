import styles from './StatesCommon.module.scss'

export default function RedirectingState({
	destination
}: {
	destination: string
}) {
	return (
		<div className={styles.card}>
			<div className={styles.spinner} />

			<h1 className={styles.cardTitle}>Перенаправляем вас...</h1>
			<p className={styles.cardSubtitle}>
				Переходим по ссылке назначения.
			</p>

			<div className={styles.urlBox}>
				<span className={styles.urlText}>{destination}</span>
			</div>

			<a
				href={destination}
				className={styles.fallbackLink}
			>
				Нажмите здесь, если ничего не происходит
			</a>
		</div>
	)
}
