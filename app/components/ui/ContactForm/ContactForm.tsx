'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, XCircle } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../Button'
import styles from './ContactForm.module.scss'
import {
	ContactFormData,
	contactSchema,
	formFields,
	FormStatus
} from './contactForm.config'
import { SuccessMessage } from './SuccessMessage'

interface ContactFormProps {
	onSuccess?: () => void
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
	const [status, setStatus] = useState<FormStatus>('idle')

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid }
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
		mode: 'onChange'
	})

	const onSubmit = useCallback(async () => {
		setStatus('submitting')

		try {
			await new Promise(resolve => setTimeout(resolve, 1500))
			setStatus('success')
			reset()
			onSuccess?.()
		} catch (error) {
			console.error('Ошибка отправки:', error)
			setStatus('error')
		}
	}, [reset, onSuccess])

	const resetForm = useCallback(() => setStatus('idle'), [])

	if (status === 'success') {
		return <SuccessMessage onReset={resetForm} />
	}

	const isSubmitting = status === 'submitting'

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			{formFields.map(field => (
				<div key={field.id} className={styles.field}>
					<label htmlFor={field.id}>{field.label}</label>
					{field.type === 'textarea' ? (
						<textarea
							id={field.id}
							placeholder={field.placeholder}
							rows={field.rows}
							className={errors[field.id] ? styles.inputError : ''}
							disabled={isSubmitting}
							{...register(field.id)}
						/>
					) : (
						<input
							id={field.id}
							type={field.type}
							placeholder={field.placeholder}
							className={errors[field.id] ? styles.inputError : ''}
							disabled={isSubmitting}
							{...register(field.id)}
						/>
					)}
					{errors[field.id] && (
						<span className={styles.errorMessage}>
							{errors[field.id]?.message}
						</span>
					)}
				</div>
			))}

			{status === 'error' && (
				<div className={styles.serverError}>
					<XCircle size={20} />
					<span>Произошла ошибка при отправке. Попробуйте позже.</span>
				</div>
			)}

			<div className={styles.actions}>
				<Button
					type='submit'
					variant='primary'
					size='lg'
					disabled={isSubmitting || !isValid}
				>
					{isSubmitting ? (
						<span className={styles.loadingInner}>
							<Loader2 className={styles.spinner} size={20} />
							Отправка...
						</span>
					) : (
						'Отправить сообщение'
					)}
				</Button>
			</div>
		</form>
	)
}

export default ContactForm
