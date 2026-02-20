'use client'

import Button from '@/app/components/ui/Button/Button'
import { useFocusTrap } from '@/app/features/shared/hooks/useFocusTrap'
import { useRef, useState } from 'react'
import styles from './DateRangePicker.module.scss'

interface DateRangePickerProps {
	startDate?: string
	endDate?: string
	error?: string | null
	title?: string
	cancelLabel?: string
	applyLabel?: string
	onStartDateChange?: (value: string) => void
	onEndDateChange?: (value: string) => void
	onApply: (startDate: string, endDate: string) => void
	onCancel: () => void
}

export default function DateRangePicker({
	startDate,
	endDate,
	error,
	title = 'Выберите период',
	cancelLabel = 'Отмена',
	applyLabel = 'Применить',
	onStartDateChange,
	onEndDateChange,
	onApply,
	onCancel
}: DateRangePickerProps) {
	const pickerRef = useRef<HTMLDivElement | null>(null)
	const [localStartDate, setLocalStartDate] = useState('')
	const [localEndDate, setLocalEndDate] = useState('')

	useFocusTrap(pickerRef)

	const isControlled =
		typeof startDate === 'string' && typeof endDate === 'string'
	const currentStartDate = isControlled ? startDate : localStartDate
	const currentEndDate = isControlled ? endDate : localEndDate

	const handleStartDateChange = (value: string) => {
		if (isControlled) {
			onStartDateChange?.(value)
			return
		}
		setLocalStartDate(value)
	}

	const handleEndDateChange = (value: string) => {
		if (isControlled) {
			onEndDateChange?.(value)
			return
		}
		setLocalEndDate(value)
	}

	return (
		<>
			<div
				className={styles.overlay}
				onMouseDown={onCancel}
			/>
			<div
				ref={pickerRef}
				className={styles.picker}
				onMouseDown={e => e.stopPropagation()}
				onClick={e => e.stopPropagation()}
				role='dialog'
				aria-modal='true'
				aria-label='Выберите период'
				tabIndex={-1}
			>
				<div className={styles.title}>{title}</div>
				<div className={styles.inputs}>
					<div className={styles.field}>
						<label className={styles.label}>Начало</label>
						<input
							type='date'
							className={styles.input}
							value={currentStartDate}
							onChange={e => handleStartDateChange(e.target.value)}
						/>
					</div>
					<div className={styles.field}>
						<label className={styles.label}>Конец</label>
						<input
							type='date'
							className={styles.input}
							value={currentEndDate}
							onChange={e => handleEndDateChange(e.target.value)}
						/>
					</div>
				</div>
				{error ? <p className={styles.error}>{error}</p> : null}
				<div className={styles.actions}>
					<Button
						variant='outline'
						size='sm'
						onClick={onCancel}
					>
						{cancelLabel}
					</Button>
					<Button
						variant='primary'
						size='sm'
						onClick={() => onApply(currentStartDate, currentEndDate)}
						disabled={!currentStartDate || !currentEndDate}
					>
						{applyLabel}
					</Button>
				</div>
			</div>
		</>
	)
}
