import authSharedStyles from '@/app/(auth)/AuthShared.module.scss'
import styles from './FormContent.module.scss'

interface FormFieldProps {
	id: string
	label: string
	type: 'text' | 'email'
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
	error?: string
}

export default function FormField({
	id,
	label,
	type,
	placeholder,
	value,
	onChange,
	autoComplete,
	error
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
				name={id}
				type={type}
				className={`${styles.input} ${error ? authSharedStyles.inputError : ''}`}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				autoComplete={autoComplete}
				aria-invalid={!!error}
				aria-describedby={error ? `${id}-error` : undefined}
			/>

			{error && (
				<p
					id={`${id}-error`}
					className={authSharedStyles.errorText}
				>
					{error}
				</p>
			)}
		</div>
	)
}
