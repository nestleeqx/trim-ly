import Button from '@/app/components/ui/Button/Button'
import { Link2Off } from 'lucide-react'
import Link from 'next/link'
import styles from './StatesCommon.module.scss'

export default function NotFoundState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconRed}`}>
				<Link2Off size={24} />
			</div>

			<h1 className={styles.cardTitle}>Ссылка не существует</h1>
			<p className={styles.cardSubtitle}>
				Возможно, она была удалена, срок действия истёк, или вы ошиблись
				в URL.
			</p>

			<Link
				href='/'
				className={styles.primaryBtn}
			>
				<Button
					variant='primary'
					size='lg'
				>
					На главную
				</Button>
			</Link>
		</div>
	)
}
