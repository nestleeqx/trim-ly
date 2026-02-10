import Button from '@/app/components/ui/Button/Button'
import { Pause } from 'lucide-react'
import Link from 'next/link'
import styles from './StatesCommon.module.scss'

export default function PausedState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconOrange}`}>
				<Pause size={24} />
			</div>

			<h1 className={styles.cardTitle}>Временно отключена</h1>
			<p className={styles.cardSubtitle}>
				Владелец приостановил эту ссылку. Попробуйте позже.
			</p>

			<Link
				href='/'
				className={styles.darkBtn}
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
