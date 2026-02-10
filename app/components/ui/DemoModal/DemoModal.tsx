'use client'

import Modal from '@/app/components/ui/Modal/Modal'
import { Play } from 'lucide-react'
import styles from './DemoModal.module.scss'

interface DemoModalProps {
	isOpen: boolean
	onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Демонстрация trim.ly'
		>
			<div className={styles.videoWrapper}>
				<div className={styles.placeholder}>
					<div className={styles.playButton}>
						<Play size={48} />
					</div>
					<p className={styles.text}>
						Видео демонстрация скоро будет доступна
					</p>
					<p className={styles.subtext}>
						Здесь появится видео с обзором всех возможностей
						платформы
					</p>
				</div>
			</div>
		</Modal>
	)
}
