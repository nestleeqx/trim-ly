'use client'

import Button from '@/app/components/ui/Button/Button'
import { useFocusTrap } from '@/app/features/shared/hooks/useFocusTrap'
import { useRef, useState } from 'react'
import styles from './DateRangePicker.module.scss'

interface DateRangePickerProps {
	onApply: (startDate: string, endDate: string) => void
	onCancel: () => void
}

export default function DateRangePicker({
	onApply,
	onCancel
}: DateRangePickerProps) {
	const pickerRef = useRef<HTMLDivElement | null>(null)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	useFocusTrap(pickerRef)

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
				<div className={styles.title}>Выберите период</div>
				<div className={styles.inputs}>
					<div className={styles.field}>
						<label className={styles.label}>Начало</label>
						<input
							type='date'
							className={styles.input}
							value={startDate}
							onChange={e => setStartDate(e.target.value)}
						/>
					</div>
					<div className={styles.field}>
						<label className={styles.label}>Конец</label>
						<input
							type='date'
							className={styles.input}
							value={endDate}
							onChange={e => setEndDate(e.target.value)}
						/>
					</div>
				</div>
				<div className={styles.actions}>
					<Button
						variant='outline'
						size='sm'
						onClick={onCancel}
					>
						Отмена
					</Button>
					<Button
						variant='primary'
						size='sm'
						onClick={() => onApply(startDate, endDate)}
						disabled={!startDate || !endDate}
					>
						Применить
					</Button>
				</div>
			</div>
		</>
	)
}
