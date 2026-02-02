import classNames from 'classnames'
import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
	children: React.ReactNode
	variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	onClick?: () => void
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
	className?: string
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'primary',
	size = 'md',
	onClick,
	type = 'button',
	disabled = false,
	className
}) => {
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
		>
			{children}
		</button>
	)
}

export default Button
