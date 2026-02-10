import Button from '@/app/components/ui/Button/Button'
import { Clock } from 'lucide-react'
import Link from 'next/link'
import styles from './StatesCommon.module.scss'

export default function ExpiredState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconGray}`}>
				<Clock size={24} />
			</div>

			<h1 className={styles.cardTitle}>Ссылка устарела</h1>
			<p className={styles.cardSubtitle}>
				Владелец установил срок действия для этой ссылки, который истёк.
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
