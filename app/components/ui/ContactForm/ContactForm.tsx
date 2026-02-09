'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../Button'
import {
	ContactFormData,
	contactSchema,
	formFields,
	FormStatus
} from './contactForm.config'
import styles from './ContactForm.module.scss'
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
		formState: { errors, isValid, isSubmitting }
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
		mode: 'onChange'
	})

	if (status === 'success') {
		return <SuccessMessage onReset={() => setStatus('idle')} />
	}

	const onSubmit = async () => {
		setStatus('idle')
		try {
			await new Promise(resolve => setTimeout(resolve, 1500))
			setStatus('success')
			reset()
			onSuccess?.()
		} catch (e) {
			console.error('Ошибка отправки:', e)
			setStatus('error')
		}
	}

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			{formFields.map(field => {
				const hasError = !!errors[field.id]
				const commonProps = {
					id: field.id,
					placeholder: field.placeholder,
					disabled: isSubmitting,
					className: hasError ? styles.inputError : '',
					...register(field.id)
				}

				return (
					<div
						key={field.id}
						className={styles.field}
					>
						<label htmlFor={field.id}>{field.label}</label>

						{field.type === 'textarea' ? (
							<textarea
								{...commonProps}
								rows={field.rows}
							/>
						) : (
							<input
								{...commonProps}
								type={field.type}
							/>
						)}

						{hasError && (
							<span className={styles.errorMessage}>
								{errors[field.id]?.message}
							</span>
						)}
					</div>
				)
			})}

			{status === 'error' && (
				<div className={styles.serverError}>
					<XCircle size={20} />
					<span>
						Произошла ошибка при отправке. Попробуйте позже.
					</span>
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
		</form>
	)
}

export default ContactForm
