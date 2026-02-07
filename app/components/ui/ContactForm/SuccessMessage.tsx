import { CheckCircle } from 'lucide-react'
import Button from '../Button'
import styles from './ContactForm.module.scss'

interface SuccessMessageProps {
	onReset: () => void
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ onReset }) => {
	return (
		<div className={styles.feedbackContainer}>
			<CheckCircle
				className={styles.successIcon}
				size={64}
			/>
			<h3>Сообщение отправлено!</h3>
			<p>Мы свяжемся с вами в ближайшее время.</p>
			<Button
				variant='outline'
				onClick={onReset}
				className={styles.resetButton}
			>
				Отправить еще одно
			</Button>
		</div>
	)
}
