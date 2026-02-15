'use client'

import FormField from '@/app/components/ui/FormField'
import Button from '@/app/components/ui/Button/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
	ContactFormData,
	contactSchema,
	formFields,
	FormStatus
} from './contactForm.config'
import styles from './ContactForm.module.scss'
import SuccessMessage from './SuccessMessage'

interface ContactFormProps {
	onSuccess?: () => void
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
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
			<div className={styles.demoNotice}>
				Это демо-форма для портфолио. Сообщения не отправляются в реальную
				поддержку.
			</div>

			{formFields.map(field => {
				const errorMessage = errors[field.id]?.message
				const sharedProps = {
					id: field.id,
					label: field.label,
					placeholder: field.placeholder,
					disabled: isSubmitting,
					error:
						typeof errorMessage === 'string'
							? errorMessage
							: undefined
				}

				return field.type === 'textarea' ? (
					<FormField
						key={field.id}
						as='textarea'
						rows={field.rows}
						{...sharedProps}
						textareaProps={{
							...register(field.id)
						}}
					/>
				) : (
					<FormField
						key={field.id}
						type={field.type}
						{...sharedProps}
						inputProps={{
							...register(field.id)
						}}
					/>
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
