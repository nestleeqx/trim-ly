import FormField from '@/app/components/ui/FormField'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { ContactFormData, formFields } from './contactForm.config'

interface ContactFormFieldsProps {
	register: UseFormRegister<ContactFormData>
	errors: FieldErrors<ContactFormData>
	isSubmitting: boolean
}

export default function ContactFormFields({
	register,
	errors,
	isSubmitting
}: ContactFormFieldsProps) {
	return (
		<>
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
						textareaProps={register(field.id)}
					/>
				) : (
					<FormField
						key={field.id}
						type={field.type}
						{...sharedProps}
						inputProps={register(field.id)}
					/>
				)
			})}
		</>
	)
}
