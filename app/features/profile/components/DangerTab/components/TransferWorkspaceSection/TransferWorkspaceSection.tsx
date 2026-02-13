import Button from '@/app/components/ui/Button/Button'
import styles from '../../DangerTab.module.scss'

type Props = {
	onTransferClick: () => void
}

export default function TransferWorkspaceSection({ onTransferClick }: Props) {
	return (
		<div className={styles.section}>
			<div className={styles.sectionInfo}>
				<h4 className={styles.sectionTitle}>
					Передать право собственности
				</h4>
				<p className={styles.sectionDesc}>
					Передать это рабочее пространство и все его данные другому
					пользователю.
				</p>
			</div>
			<div className={styles.sectionAction}>
				<div className={styles.demoWrap}>
					<span className={styles.demoBadge}>Демо</span>
					<Button
						variant='ghost'
						onClick={onTransferClick}
					>
						Передать рабочее пространство
					</Button>
				</div>
			</div>
		</div>
	)
}
