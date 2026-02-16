'use client'

import React from 'react'
import styles from './ToggleSwitch.module.scss'

interface ToggleSwitchProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
	onLabel?: string
	offLabel?: string
}

export default function ToggleSwitch({
	checked,
	onChange,
	label,
	onLabel = 'Включена',
	offLabel = 'Отключена'
}: ToggleSwitchProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter') return
		e.preventDefault()
		onChange(!checked)
	}

	return (
		<label className={styles.toggle}>
			{label && <span className={styles.label}>{label}</span>}
			<input
				type='checkbox'
				checked={checked}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				className={styles.toggleInput}
			/>
			<span className={styles.toggleSlider}></span>
			<span className={styles.toggleLabel}>
				{checked ? onLabel : offLabel}
			</span>
		</label>
	)
}
