import classNames from 'classnames'
import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
	children: React.ReactNode
	variant?:
		| 'primary'
		| 'invertPrimary'
		| 'secondary'
		| 'ghost'
		| 'invertGhost'
		| 'outline'
		| 'invertOutline'
	size?: 'sm' | 'md' | 'lg'
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	className?: string
	title?: string
}

export default function Button({
	children,
	variant = 'primary',
	size = 'md',
	onClick,
	type = 'button',
	disabled = false,
	title,
	className
}: ButtonProps) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={classNames(
				styles.button,
				styles[variant],
				styles[size],
				className
			)}
			disabled={disabled}
			aria-label={title}
		>
			{children}
		</button>
	)
}
