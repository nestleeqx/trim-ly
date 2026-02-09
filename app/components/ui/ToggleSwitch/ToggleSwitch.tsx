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

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
	checked,
	onChange,
	label,
	onLabel = 'Включена',
	offLabel = 'Отключена'
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.checked)
	}

	return (
		<label className={styles.toggle}>
			{label && <span className={styles.label}>{label}</span>}
			<input
				type='checkbox'
				checked={checked}
				onChange={handleChange}
				className={styles.toggleInput}
			/>
			<span className={styles.toggleSlider}></span>
			<span className={styles.toggleLabel}>
				{checked ? onLabel : offLabel}
			</span>
		</label>
	)
}

export default ToggleSwitch
