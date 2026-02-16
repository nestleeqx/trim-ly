'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { XCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ContactFormData, contactSchema, FormStatus } from './contactForm.config'
import ContactFormFields from './ContactFormFields'
import ContactFormSubmitButton from './ContactFormSubmitButton'
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

			<ContactFormFields
				register={register}
				errors={errors}
				isSubmitting={isSubmitting}
			/>

			{status === 'error' ? (
				<div className={styles.serverError}>
					<XCircle size={20} />
					<span>Произошла ошибка при отправке. Попробуйте позже.</span>
				</div>
			) : null}

			<ContactFormSubmitButton
				isSubmitting={isSubmitting}
				isValid={isValid}
			/>
		</form>
	)
}
