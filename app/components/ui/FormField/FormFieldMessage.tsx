import styles from './FormField.module.scss'

interface FormFieldMessageProps {
	id: string
	error?: string
	hint?: string
}

export default function FormFieldMessage({
	id,
	error,
	hint
}: FormFieldMessageProps) {
	if (error) {
		return (
			<p
				id={`${id}-error`}
				className={styles.error}
			>
				{error}
			</p>
		)
	}

	if (hint) {
		return (
			<p
				id={`${id}-hint`}
				className={styles.hint}
			>
				{hint}
			</p>
		)
	}

	return null
}
