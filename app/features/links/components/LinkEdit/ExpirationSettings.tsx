'use client'

import cn from 'classnames'
import { AlertCircle, Calendar, X } from 'lucide-react'
import React, { useCallback } from 'react'
import styles from './LinkEdit.module.scss'

interface ExpirationSettingsProps {
	expirationDate: string
	expirationError?: string
	onExpirationChange: (value: string) => void
	onClearExpiration: () => void
}

export default function ExpirationSettings({
	expirationDate,
	expirationError,
	onExpirationChange,
	onClearExpiration
}: ExpirationSettingsProps) {
	const handleExpirationChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			onExpirationChange(value)
		},
		[onExpirationChange]
	)

	return (
		<div className={styles.formGroup}>
			<label className={styles.label}>
				<Calendar size={16} />
				Дата истечения
			</label>
			<div className={styles.dateInputWrapper}>
				<input
					type='date'
					name='expirationDate'
					value={expirationDate}
					onChange={handleExpirationChange}
					className={cn(styles.input, {
						[styles.error]: expirationError
					})}
				/>
				{expirationDate && (
					<button
						type='button'
						className={styles.clearDateBtn}
						onClick={onClearExpiration}
					>
						<X size={16} />
					</button>
				)}
			</div>
			{expirationError && (
				<span className={styles.fieldError}>
					<AlertCircle size={12} />
					{expirationError}
				</span>
			)}
		</div>
	)
}
