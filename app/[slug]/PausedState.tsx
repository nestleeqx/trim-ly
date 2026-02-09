import { Pause } from 'lucide-react'
import Link from 'next/link'
import Button from '../components/ui/Button'
import styles from './page.module.scss'

const PausedState: React.FC = () => {
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

export default PausedState
