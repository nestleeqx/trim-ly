'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Button from '../../ui/Button'
import styles from './ContactForm.module.scss'

const contactSchema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	email: z.string().email('Введите корректный email адрес'),
	message: z.string().min(10, 'Сообщение должно быть не менее 10 символов')
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
	onSuccess?: () => void
}

const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
	const [status, setStatus] = useState<
		'idle' | 'submitting' | 'success' | 'error'
	>('idle')

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid }
	} = useForm<ContactFormData>({
		resolver: zodResolver(contactSchema),
		mode: 'onChange'
	})

	const onSubmit = async () => {
		setStatus('submitting')

		try {
			await new Promise(resolve => setTimeout(resolve, 1500))
			setStatus('success')
			reset()

			if (onSuccess) {
				onSuccess()
			}
		} catch (error) {
			console.error('Ошибка отправки:', error)
			setStatus('error')
		}
	}

	if (status === 'success') {
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
					onClick={() => setStatus('idle')}
					className={styles.resetButton}
				>
					Отправить еще одно
				</Button>
			</div>
		)
	}

	return (
		<form
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
			noValidate
		>
			<div className={styles.field}>
				<label htmlFor='name'>Ваше имя</label>
				<input
					id='name'
					type='text'
					placeholder='Иван Иванов'
					className={errors.name ? styles.inputError : ''}
					disabled={status === 'submitting'}
					{...register('name')}
				/>
				{errors.name && (
					<span className={styles.errorMessage}>
						{errors.name.message}
					</span>
				)}
			</div>

			<div className={styles.field}>
				<label htmlFor='email'>Email</label>
				<input
					id='email'
					type='email'
					placeholder='ivan@example.com'
					className={errors.email ? styles.inputError : ''}
					disabled={status === 'submitting'}
					{...register('email')}
				/>
				{errors.email && (
					<span className={styles.errorMessage}>
						{errors.email.message}
					</span>
				)}
			</div>

			<div className={styles.field}>
				<label htmlFor='message'>Сообщение</label>
				<textarea
					id='message'
					placeholder='Расскажите о потребностях вашей команды...'
					rows={4}
					className={errors.message ? styles.inputError : ''}
					disabled={status === 'submitting'}
					{...register('message')}
				/>
				{errors.message && (
					<span className={styles.errorMessage}>
						{errors.message.message}
					</span>
				)}
			</div>

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
					disabled={status === 'submitting' || !isValid}
				>
					{status === 'submitting' ? (
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
