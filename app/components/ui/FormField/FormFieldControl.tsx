import cn from 'classnames'
import type { FormFieldProps } from './types'
import styles from './FormField.module.scss'

interface FormFieldControlProps {
	props: FormFieldProps
	controlBaseClass: string
	disabled: boolean
	required: boolean
	describedBy?: string
	hasError: boolean
}

export default function FormFieldControl({
	props,
	controlBaseClass,
	disabled,
	required,
	describedBy,
	hasError
}: FormFieldControlProps) {
	if (props.as === 'textarea') {
		return (
			<textarea
				id={props.id}
				name={props.name ?? props.id}
				rows={props.rows ?? 4}
				value={props.value}
				onChange={props.onChange}
				onBlur={props.onBlur}
				placeholder={props.placeholder}
				autoComplete={props.autoComplete}
				required={required}
				disabled={disabled}
				aria-invalid={hasError}
				aria-describedby={describedBy}
				className={cn(styles.textarea, controlBaseClass)}
				{...props.textareaProps}
			/>
		)
	}

	return (
		<input
			id={props.id}
			name={props.name ?? props.id}
			type={props.type ?? 'text'}
			value={props.value}
			onChange={props.onChange}
			onBlur={props.onBlur}
			placeholder={props.placeholder}
			autoComplete={props.autoComplete}
			required={required}
			disabled={disabled}
			aria-invalid={hasError}
			aria-describedby={describedBy}
			className={controlBaseClass}
			{...props.inputProps}
		/>
	)
}
