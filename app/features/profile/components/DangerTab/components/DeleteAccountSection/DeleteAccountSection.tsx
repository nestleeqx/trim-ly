import Button from '@/app/components/ui/Button/Button'
import styles from '../../DangerTab.module.scss'

type Props = {
	onDeleteClick: () => void
}

export default function DeleteAccountSection({ onDeleteClick }: Props) {
	return (
		<div className={styles.section}>
			<div className={styles.sectionInfo}>
				<h4 className={styles.sectionTitle}>Удалить аккаунт</h4>
				<p className={styles.sectionDesc}>
					Безвозвратно удалить аккаунт и все связанные ссылки,
					аналитику и данные. Это действие необратимо.
				</p>
			</div>
			<div className={styles.sectionAction}>
				<Button
					variant='outline'
					className={styles.deleteBtn}
					onClick={onDeleteClick}
				>
					Удалить мой аккаунт
				</Button>
			</div>
		</div>
	)
}
