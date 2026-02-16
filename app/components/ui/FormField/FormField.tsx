import cn from 'classnames'
import FormFieldControl from './FormFieldControl'
import FormFieldMessage from './FormFieldMessage'
import type { FormFieldProps } from './types'
import styles from './FormField.module.scss'

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

	const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
	const wrapperClass = cn(styles.field, className)
	const labelClass = cn(styles.label, labelClassName)
	const controlBaseClass = cn(styles.control, inputClassName, {
		[styles.controlError]: Boolean(error),
		[styles.withLeftIcon]: Boolean(leftIcon)
	})

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

				<FormFieldControl
					props={props}
					controlBaseClass={controlBaseClass}
					disabled={disabled}
					required={required}
					describedBy={describedBy}
					hasError={Boolean(error)}
				/>
				{rightAdornment ? (
					<span className={styles.rightAdornment}>
						{rightAdornment}
					</span>
				) : null}
			</div>

			<FormFieldMessage
				id={id}
				error={error}
				hint={hint}
			/>
		</div>
	)
}
