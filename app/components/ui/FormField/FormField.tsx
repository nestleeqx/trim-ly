import type React from 'react'
import styles from './FormField.module.scss'

type BaseProps = {
	id: string
	label: string
	labelAccessory?: React.ReactNode
	error?: string
	hint?: string
	required?: boolean
	disabled?: boolean
	className?: string
	labelClassName?: string
	inputClassName?: string
	leftIcon?: React.ReactNode
	rightAdornment?: React.ReactNode
}

type InputVariantProps = BaseProps & {
	as?: 'input'
	type?: React.HTMLInputTypeAttribute
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
	placeholder?: string
	name?: string
	autoComplete?: string
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

type TextareaVariantProps = BaseProps & {
	as: 'textarea'
	value?: string
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
	placeholder?: string
	name?: string
	rows?: number
	autoComplete?: string
	textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

type FormFieldProps = InputVariantProps | TextareaVariantProps

export default function FormField(props: FormFieldProps) {
	const {
		id,
		label,
		labelAccessory,
		error,
		hint,
		required = false,
		disabled = false,
		className,
		labelClassName,
		inputClassName,
		leftIcon,
		rightAdornment
	} = props

	const wrapperClass = `${styles.field}${className ? ` ${className}` : ''}`
	const labelClass = `${styles.label}${labelClassName ? ` ${labelClassName}` : ''}`
	const controlBaseClass = `${styles.control}${error ? ` ${styles.controlError}` : ''}${
		leftIcon ? ` ${styles.withLeftIcon}` : ''
	}${inputClassName ? ` ${inputClassName}` : ''}`

	return (
		<div className={wrapperClass}>
			<div className={styles.labelRow}>
				<label
					htmlFor={id}
					className={labelClass}
				>
					{label}
				</label>
				{labelAccessory ? (
					<span className={styles.labelAccessory}>
						{labelAccessory}
					</span>
				) : null}
			</div>

			<div className={styles.controlWrap}>
				{leftIcon ? (
					<span className={styles.leftIcon}>{leftIcon}</span>
				) : null}

				{props.as === 'textarea' ? (
					<textarea
						id={id}
						name={props.name ?? id}
						rows={props.rows ?? 4}
						value={props.value}
						onChange={props.onChange}
						onBlur={props.onBlur}
						placeholder={props.placeholder}
						autoComplete={props.autoComplete}
						required={required}
						disabled={disabled}
						aria-invalid={Boolean(error)}
						aria-describedby={
							error
								? `${id}-error`
								: hint
									? `${id}-hint`
									: undefined
						}
						className={`${controlBaseClass} ${styles.textarea}`}
						{...props.textareaProps}
					/>
				) : (
					<input
						id={id}
						name={props.name ?? id}
						type={props.type ?? 'text'}
						value={props.value}
						onChange={props.onChange}
						onBlur={props.onBlur}
						placeholder={props.placeholder}
						autoComplete={props.autoComplete}
						required={required}
						disabled={disabled}
						aria-invalid={Boolean(error)}
						aria-describedby={
							error
								? `${id}-error`
								: hint
									? `${id}-hint`
									: undefined
						}
						className={controlBaseClass}
						{...props.inputProps}
					/>
				)}
				{rightAdornment ? (
					<span className={styles.rightAdornment}>
						{rightAdornment}
					</span>
				) : null}
			</div>

			{error ? (
				<p
					id={`${id}-error`}
					className={styles.error}
				>
					{error}
				</p>
			) : hint ? (
				<p
					id={`${id}-hint`}
					className={styles.hint}
				>
					{hint}
				</p>
			) : null}
		</div>
	)
}
