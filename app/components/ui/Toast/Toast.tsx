import cn from 'classnames'
import { AlertCircle, AlertTriangle, Check } from 'lucide-react'
import { useEffect } from 'react'
import styles from './Toast.module.scss'

export type ToastVariant = 'success' | 'error' | 'warning'

interface ToastProps {
	message: string
	isVisible: boolean
	onClose: () => void
	variant?: ToastVariant
}

const icons = {
	success: Check,
	error: AlertCircle,
	warning: AlertTriangle
}

export default function Toast({
	message,
	isVisible,
	onClose,
	variant = 'success'
}: ToastProps) {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(onClose, 3000)
			return () => clearTimeout(timer)
		}
	}, [isVisible, onClose])

	if (!isVisible) return null

	const Icon = icons[variant]

	return (
		<div className={cn(styles.toast, styles[variant])}>
			<Icon size={16} />
			<span>{message}</span>
		</div>
	)
}
