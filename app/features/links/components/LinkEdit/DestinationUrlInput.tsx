'use client'

import { normalizeUrl, stripCyrillic, validateUrl } from '@/utils/validation'
import { AlertCircle, Link2 } from 'lucide-react'
import React, { useCallback } from 'react'
import styles from './LinkEdit.module.scss'

interface DestinationUrlInputProps {
	value: string
	error?: string
	touched?: boolean
	onChange: (value: string) => void
	onError: (error: string | undefined) => void
	onTouch: () => void
}

export default function DestinationUrlInput({
	value,
	error,
	touched,
	onChange,
	onError,
	onTouch
}: DestinationUrlInputProps) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = stripCyrillic(e.target.value)
			onChange(newValue)

			const validationError = validateUrl(newValue)
			onError(validationError)
		},
		[onChange, onError]
	)

	const handleBlur = useCallback(() => {
		onTouch()
		const normalized = normalizeUrl(value)
		if (normalized !== value) onChange(normalized)
		onError(validateUrl(normalized))
	}, [value, onChange, onError, onTouch])

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>Целевой URL</label>
			<div className={styles.inputWrapper}>
				<Link2
					size={18}
					className={styles.inputIcon}
				/>
				<input
					type='text'
					name='destinationUrl'
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder='https://example.com/very/long/link'
					className={`${styles.input} ${
						touched && error ? styles.error : ''
					}`}
					required
				/>
			</div>
			{touched && error && (
				<span className={styles.fieldError}>
					<AlertCircle size={12} />
					{error}
				</span>
			)}
		</div>
	)
}
