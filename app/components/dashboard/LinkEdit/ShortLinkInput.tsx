'use client'

import { stripCyrillic } from '@/utils/validation'
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
	onAliasCheck: (value: string) => void
}

export const ShortLinkInput: React.FC<ShortLinkInputProps> = ({
	value,
	error,
	initialValue,
	aliasChecking,
	aliasAvailable,
	isEditMode,
	onChange,
	onAliasCheck
}) => {
	const aliasChanged = value !== initialValue

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = stripCyrillic(e.target.value)
			onChange(newValue)
			onAliasCheck(newValue)
		},
		[onChange, onAliasCheck]
	)

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>Короткая ссылка</label>
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
			{isEditMode && aliasChanged && !error && (
				<span className={styles.fieldWarning}>
					<AlertTriangle size={12} />
					Изменение alias сломает старую ссылку
				</span>
			)}
		</div>
	)
}
