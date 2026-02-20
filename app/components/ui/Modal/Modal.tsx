'use client'

import { X } from 'lucide-react'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
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
	const modalRef = useRef<HTMLDivElement | null>(null)
	const previouslyFocusedRef = useRef<HTMLElement | null>(null)
	const previousOverflowRef = useRef<string>('')
	const previousOverflowXRef = useRef<string>('')
	const previousHtmlOverflowRef = useRef<string>('')
	const previousBodyPaddingRightRef = useRef<string>('')

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
				return
			}

			if (event.key !== 'Tab') return

			const root = modalRef.current
			if (!root) return

			const focusable = root.querySelectorAll<HTMLElement>(
				'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
			)

			if (focusable.length === 0) {
				event.preventDefault()
				root.focus()
				return
			}

			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			const active = document.activeElement as HTMLElement | null

			if (event.shiftKey) {
				if (active === first || !root.contains(active)) {
					event.preventDefault()
					last.focus()
				}
				return
			}

			if (active === last) {
				event.preventDefault()
				first.focus()
			}
		},
		[onClose]
	)

	useLayoutEffect(() => {
		if (isOpen) {
			previouslyFocusedRef.current =
				document.activeElement as HTMLElement | null

			const html = document.documentElement
			const body = document.body

			document.addEventListener('keydown', handleKeyDown)
			previousHtmlOverflowRef.current = html.style.overflow
			previousOverflowRef.current = body.style.overflow
			previousOverflowXRef.current = body.style.overflowX
			previousBodyPaddingRightRef.current = body.style.paddingRight

			const scrollbarWidth = window.innerWidth - html.clientWidth
			html.style.overflow = 'hidden'
			body.style.overflow = 'hidden'
			body.style.overflowX = 'hidden'
			if (scrollbarWidth > 0) {
				body.style.paddingRight = `${scrollbarWidth}px`
			}

			requestAnimationFrame(() => {
				const root = modalRef.current
				if (!root) return

				const firstFocusable = root.querySelector<HTMLElement>(
					'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
				)

				if (firstFocusable) {
					firstFocusable.focus()
				} else {
					root.focus()
				}
			})
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.documentElement.style.overflow = previousHtmlOverflowRef.current
			document.body.style.overflow = previousOverflowRef.current
			document.body.style.overflowX = previousOverflowXRef.current
			document.body.style.paddingRight = previousBodyPaddingRightRef.current
			previouslyFocusedRef.current?.focus()
		}
	}, [isOpen, handleKeyDown])

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
			<div
				ref={modalRef}
				className={styles.modal}
				role='dialog'
				aria-modal='true'
				aria-label={title || 'Dialog'}
				tabIndex={-1}
			>
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
