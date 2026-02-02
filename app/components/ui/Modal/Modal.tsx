'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.scss';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
	const handleEscapeKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		},
		[onClose]
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleEscapeKey);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscapeKey);
			document.body.style.overflow = 'unset';
		};
	}, [isOpen, handleEscapeKey]);

	if (!isOpen) return null;

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.modal}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={styles.header}>
					{title && <h3 className={styles.title}>{title}</h3>}
					<button
						className={styles.closeButton}
						onClick={onClose}
						aria-label="Закрыть"
					>
						<X size={24} />
					</button>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
