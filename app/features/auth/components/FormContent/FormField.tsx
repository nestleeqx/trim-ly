import BaseFormField from '@/app/components/ui/FormField'
import styles from './FormContent.module.scss'

interface FormFieldProps {
	id: string
	label: string
	labelStyle?: 'primary' | 'secondary'
	type: 'text' | 'email'
	placeholder: string
	value: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
	disabled?: boolean
	error?: string
}

export default function FormField({
	id,
	label,
	labelStyle = 'primary',
	type,
	placeholder,
	value,
	onChange,
	autoComplete,
	disabled = false,
	error
}: FormFieldProps) {
	void labelStyle

	return (
		<BaseFormField
			id={id}
			label={label}
			type={type}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			autoComplete={autoComplete}
			disabled={disabled}
			error={error}
			className={styles.formGroup}
			inputClassName={styles.input}
		/>
	)
}
