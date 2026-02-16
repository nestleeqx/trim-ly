import Button from '@/app/components/ui/Button/Button'
import { Loader2 } from 'lucide-react'
import styles from './ContactForm.module.scss'

interface ContactFormSubmitButtonProps {
	isSubmitting: boolean
	isValid: boolean
}

export default function ContactFormSubmitButton({
	isSubmitting,
	isValid
}: ContactFormSubmitButtonProps) {
	return (
		<div className={styles.actions}>
			<Button
				type='submit'
				variant='primary'
				size='lg'
				disabled={isSubmitting || !isValid}
			>
				{isSubmitting ? (
					<span className={styles.loadingInner}>
						<Loader2
							className={styles.spinner}
							size={20}
						/>
						Отправка...
					</span>
				) : (
					'Отправить сообщение'
				)}
			</Button>
		</div>
	)
}
