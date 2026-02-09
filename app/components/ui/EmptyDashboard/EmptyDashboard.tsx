'use client'

import { Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import Button from '../../ui/Button'
import styles from './EmptyDashboard.module.scss'

const EmptyDashboard: React.FC = () => {
	return (
		<div className={styles.empty}>
			<div className={styles.illustration}>
				<div className={styles.iconWrapper}>
					<LinkIcon size={48} />
				</div>
				<div className={styles.decorations}>
					<span className={styles.dot} />
					<span className={styles.dot} />
					<span className={styles.dot} />
				</div>
			</div>
			<h2 className={styles.title}>Добро пожаловать!</h2>
			<p className={styles.subtitle}>
				Создайте свою первую короткую ссылку, чтобы начать работу.
			</p>
			<Link href='/links/new'>
				<Button
					variant='primary'
					size='lg'
					className={styles.button}
				>
					<Plus size={20} />
					Создать ссылку
				</Button>
			</Link>
		</div>
	)
}

export default EmptyDashboard
