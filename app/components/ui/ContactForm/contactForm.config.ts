import { z } from 'zod'

export const contactSchema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	email: z.string().email('Введите корректный email адрес'),
	message: z.string().min(10, 'Сообщение должно быть не менее 10 символов')
})

export type ContactFormData = z.infer<typeof contactSchema>

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface FormFieldConfig {
	id: keyof ContactFormData
	label: string
	type: 'text' | 'email' | 'textarea'
	placeholder: string
	rows?: number
}

export const formFields: FormFieldConfig[] = [
	{
		id: 'name',
		label: 'Ваше имя',
		type: 'text',
		placeholder: 'Иван Иванов'
	},
	{
		id: 'email',
		label: 'Email',
		type: 'email',
		placeholder: 'ivan@example.com'
	},
	{
		id: 'message',
		label: 'Сообщение',
		type: 'textarea',
		placeholder: 'Расскажите о потребностях вашей команды...',
		rows: 4
	}
]
