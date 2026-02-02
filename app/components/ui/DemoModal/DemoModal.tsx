'use client';

import React from 'react';
import { Play } from 'lucide-react';
import Modal from '../Modal';
import styles from './DemoModal.module.scss';

interface DemoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Демонстрация trim.ly">
			<div className={styles.videoWrapper}>
				<div className={styles.placeholder}>
					<div className={styles.playButton}>
						<Play size={48} />
					</div>
					<p className={styles.text}>Видео демонстрация скоро будет доступна</p>
					<p className={styles.subtext}>
						Здесь появится видео с обзором всех возможностей платформы
					</p>
				</div>
			</div>
		</Modal>
	);
};

export default DemoModal;
