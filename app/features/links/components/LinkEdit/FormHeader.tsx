'use client'

import { LinkItem } from '@/types/links'
import { statusLabels } from './linkEdit.config'
import styles from './LinkEdit.module.scss'

interface FormHeaderProps {
	link: LinkItem
	isDirty: boolean
}

export default function FormHeader({ link, isDirty }: FormHeaderProps) {
	return (
		<div className={styles.formStatus}>
			<span className={styles.statusLabel}>Статус ссылки:</span>
			<div className={styles.statusValue}>
				<span
					className={`${styles.statusBadge} ${styles[link.status]}`}
				>
					{statusLabels[link.status]}
				</span>
				{isDirty && (
					<span className={styles.dirtyIndicator}>
						Есть несохранённые изменения
					</span>
				)}
			</div>
		</div>
	)
}
