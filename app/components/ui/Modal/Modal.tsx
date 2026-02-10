'use client'

import { X } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from './Modal.module.scss'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	title?: string
}

export default function Modal({
	isOpen,
	onClose,
	children,
	title
}: ModalProps) {
	const mouseDownTarget = useRef<EventTarget | null>(null)

	const handleEscapeKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		},
		[onClose]
	)

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleEscapeKey)
			document.body.style.overflow = 'hidden'
		}

		return () => {
			document.removeEventListener('keydown', handleEscapeKey)
			document.body.style.overflow = 'unset'
		}
	}, [isOpen, handleEscapeKey])

	const handleMouseDown = (e: React.MouseEvent) => {
		mouseDownTarget.current = e.target
	}

	const handleMouseUp = (e: React.MouseEvent) => {
		if (
			mouseDownTarget.current === e.target &&
			e.target === e.currentTarget
		) {
			onClose()
		}
		mouseDownTarget.current = null
	}

	if (!isOpen) return null

	return (
		<div
			className={styles.overlay}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<div className={styles.modal}>
				<div className={styles.header}>
					{title && <h3 className={styles.title}>{title}</h3>}
					<button
						className={styles.closeButton}
						onClick={onClose}
						aria-label='Закрыть'
					>
						<X size={24} />
					</button>
				</div>
				<div className={styles.content}>{children}</div>
			</div>
		</div>
	)
}
