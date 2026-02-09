'use client'

import { AlertCircle, Calendar, X } from 'lucide-react'
import React, { useCallback } from 'react'
import styles from './LinkEdit.module.scss'

interface ExpirationSettingsProps {
	expirationDate: string
	expirationError?: string
	onExpirationChange: (value: string) => void
	onClearExpiration: () => void
}

export const ExpirationSettings: React.FC<ExpirationSettingsProps> = ({
	expirationDate,
	expirationError,
	onExpirationChange,
	onClearExpiration
}) => {
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
					className={`${styles.input} ${
						expirationError ? styles.error : ''
					}`}
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
