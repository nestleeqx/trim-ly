'use client'

import FormField from '@/app/components/ui/FormField'
import { normalizeUrl, validateUrl } from '@/utils/validation'
import { Link2 } from 'lucide-react'
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
			const newValue = e.target.value
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
		<FormField
			id='destinationUrl'
			label='Целевой URL'
			type='text'
			value={value}
			onChange={handleChange}
			onBlur={handleBlur}
			placeholder='https://example.com/very/long/link'
			error={touched ? error : undefined}
			required
			leftIcon={<Link2 size={18} />}
			className={styles.formGroup}
			labelClassName={styles.label}
			inputClassName={styles.input}
		/>
	)
}
