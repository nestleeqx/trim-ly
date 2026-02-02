import { Check } from 'lucide-react'
import { useEffect } from 'react'
import styles from './Toast.module.scss'

const Toast = ({
	message,
	isVisible,
	onClose
}: {
	message: string
	isVisible: boolean
	onClose: () => void
}) => {
	useEffect(() => {
		if (isVisible) {
			const timer = setTimeout(onClose, 2000)
			return () => clearTimeout(timer)
		}
	}, [isVisible, onClose])

	if (!isVisible) return null

	return (
		<div className={styles.toast}>
			<Check size={16} />
			<span>{message}</span>
		</div>
	)
}

export default Toast
