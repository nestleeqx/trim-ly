'use client'

import cn from 'classnames'
import { Calendar } from 'lucide-react'
import React from 'react'
import styles from './PeriodSelector.module.scss'

export interface PeriodOption {
	key: string
	label: string
}

interface PeriodSelectorProps {
	options: PeriodOption[]
	activeKey: string
	onChange: (key: string) => void
	disabled?: boolean
	getLabel?: (option: PeriodOption) => React.ReactNode
	showCalendarOnKey?: string
}

export default function PeriodSelector({
	options,
	activeKey,
	onChange,
	disabled = false,
	getLabel,
	showCalendarOnKey = 'custom'
}: PeriodSelectorProps) {
	return (
		<div className={styles.periods}>
			{options.map(option => {
				const label = getLabel ? getLabel(option) : option.label
				return (
					<button
						key={option.key}
						type='button'
						className={cn(styles.periodBtn, {
							[styles.active]: activeKey === option.key
						})}
						onClick={() => onChange(option.key)}
						disabled={disabled}
					>
						{option.key === showCalendarOnKey ? (
							<Calendar size={14} />
						) : null}
						{label}
					</button>
				)
			})}
		</div>
	)
}
