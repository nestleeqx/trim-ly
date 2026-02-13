'use client'

import { AlertCircle, AlertTriangle, Check, Loader2 } from 'lucide-react'
import React, { useCallback } from 'react'
import styles from './LinkEdit.module.scss'
import { SHORT_LINK_DOMAIN } from './linkEdit.config'

interface ShortLinkInputProps {
	value: string
	error?: string
	initialValue: string
	aliasChecking: boolean
	aliasAvailable: boolean
	isEditMode: boolean
	onChange: (value: string) => void
}

export default function ShortLinkInput({
	value,
	error,
	initialValue,
	aliasChecking,
	aliasAvailable,
	isEditMode,
	onChange
}: ShortLinkInputProps) {
	const aliasChanged = value !== initialValue

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value
			onChange(newValue)
		},
		[onChange]
	)

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>Short link</label>
			<div
				className={`${styles.shortLinkWrapper} ${
					error ? styles.error : ''
				} ${aliasAvailable ? styles.success : ''}`}
			>
				<span className={styles.shortLinkPrefix}>
					{SHORT_LINK_DOMAIN}
				</span>
				<input
					type='text'
					name='shortLink'
					value={value}
					onChange={handleChange}
					placeholder='alias'
					className={styles.shortLinkInput}
					maxLength={25}
				/>
				{aliasChecking && (
					<Loader2
						size={16}
						className={styles.aliasSpinner}
					/>
				)}
				{!aliasChecking && aliasAvailable && (
					<Check
						size={16}
						className={styles.aliasSuccess}
					/>
				)}
			</div>
			{error && (
				<span className={styles.fieldError}>
					<AlertCircle size={12} />
					{error}
				</span>
			)}
			<span className={styles.hint}>
				Используйте латиницу: a-z, 0-9, &quot;-&quot; и &quot;_&quot;.
			</span>
			{isEditMode && aliasChanged && !error && (
				<span className={styles.fieldWarning}>
					<AlertTriangle size={12} />
					Changing alias will break the old short URL
				</span>
			)}
		</div>
	)
}
