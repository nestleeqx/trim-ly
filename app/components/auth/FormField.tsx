import styles from './AuthShared.module.scss'

interface FormFieldProps {
	id: string
	label: string
	type: 'text' | 'email'
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
}

export const FormField: React.FC<FormFieldProps> = ({
	id,
	label,
	type,
	placeholder,
	value,
	onChange,
	autoComplete
}) => {
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
