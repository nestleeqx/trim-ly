import Button from '@/app/components/ui/Button/Button'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import styles from './StatesCommon.module.scss'

export default function ErrorState() {
	return (
		<div className={styles.card}>
			<div className={`${styles.stateIcon} ${styles.stateIconRed}`}>
				<AlertTriangle size={24} />
			</div>

			<h1 className={styles.cardTitle}>Что-то пошло не так</h1>
			<p className={styles.cardSubtitle}>
				Не удалось перенаправить вас из-за ошибки сервера.
			</p>

			<div className={styles.buttonGroup}>
				<Button
					variant='primary'
					size='lg'
					onClick={() => window.location.reload()}
				>
					Попробовать снова
				</Button>
				<Link
					href='/'
					className={styles.outlineBtn}
				>
					<Button
						variant='ghost'
						size='lg'
					>
						На главную
					</Button>
				</Link>
			</div>
		</div>
	)
}
