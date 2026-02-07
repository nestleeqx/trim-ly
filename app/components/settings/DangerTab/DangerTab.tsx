import { AlertTriangle } from 'lucide-react'
import Button from '../../ui/Button'
import styles from './DangerTab.module.scss'

export default function DangerTab() {
	return (
		<div className={styles.card}>
			<div className={styles.headerRow}>
				<div className={styles.headerLeft}>
					<div className={styles.iconWrap}>
						<AlertTriangle size={18} />
					</div>
					<div>
						<h3 className={styles.title}>Опасная зона</h3>
						<p className={styles.subtitle}>
							Эти действия постоянны и не могут быть отменены.
							Пожалуйста, действуйте осторожно.
						</p>
					</div>
				</div>
			</div>

			<div className={styles.section}>
				<div className={styles.sectionInfo}>
					<h4 className={styles.sectionTitle}>Удалить аккаунт</h4>
					<p className={styles.sectionDesc}>
						Безвозвратно удалить аккаунт и все связанные ссылки,
						аналитику и данные. Это действие не обратимо.
					</p>
				</div>
				<div className={styles.sectionAction}>
					<Button
						variant='outline'
						className={styles.deleteBtn}
					>
						Удалить мой аккаунт
					</Button>
				</div>
			</div>
			<div className={styles.section}>
				<div className={styles.sectionInfo}>
					<h4 className={styles.sectionTitle}>
						Передать право собственности
					</h4>
					<p className={styles.sectionDesc}>
						Передать это рабочее пространство и все его данные
						другому пользователю. Вы сразу потеряете доступ.
					</p>
				</div>
				<div className={styles.sectionAction}>
					<Button variant='ghost'>
						Передать рабочее пространство
					</Button>
				</div>
			</div>
		</div>
	)
}
