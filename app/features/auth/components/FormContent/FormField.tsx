import authSharedStyles from '@/app/(auth)/AuthShared.module.scss'
import cn from 'classnames'
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
	return (
		<div className={styles.formGroup}>
			<label
				className={cn(styles.label, {
					[styles.labelPrimary]: labelStyle === 'primary',
					[styles.labelSecondary]: labelStyle === 'secondary'
				})}
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
				disabled={disabled}
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
