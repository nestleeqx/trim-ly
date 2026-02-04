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

const Toast: React.FC<ToastProps> = ({
	message,
	isVisible,
	onClose,
	variant = 'success'
}) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(onClose, 3000)
			return () => clearTimeout(timer)
		}
	}, [isVisible, onClose])

	if (!isVisible) return null

	const Icon = icons[variant]

	return (
		<div className={`${styles.toast} ${styles[variant]}`}>
			<Icon size={16} />
			<span>{message}</span>
		</div>
	)
}

export default Toast
