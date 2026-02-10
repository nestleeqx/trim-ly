import styles from './FormContent.module.scss'

interface FormFieldProps {
	id: string
	label: string
	type: 'text' | 'email'
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
}

export default function FormField({
	id,
	label,
	type,
	placeholder,
	value,
	onChange,
	autoComplete
}: FormFieldProps) {
	return (
		<div className={styles.formGroup}>
			<label
				className={styles.label}
				htmlFor={id}
			>
				{label}
			</label>
			<input
				id={id}
				type={type}
				className={styles.input}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				autoComplete={autoComplete}
			/>
		</div>
	)
}
