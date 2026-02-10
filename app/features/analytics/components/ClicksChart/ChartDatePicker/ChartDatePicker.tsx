import styles from './ChartDatePicker.module.scss'

interface ChartDatePickerProps {
	show: boolean
	startDate: string
	endDate: string
	onStartDateChange: (date: string) => void
	onEndDateChange: (date: string) => void
	onApply: () => void
	onCancel: () => void
}

export default function ChartDatePicker({
	show,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onApply,
	onCancel
}: ChartDatePickerProps) {
	if (!show) return null

	return (
		<>
			<div
				className={styles.datePickerOverlay}
				onClick={onCancel}
			/>
			<div className={styles.datePicker}>
				<div className={styles.datePickerTitle}>Выберите период</div>
				<div className={styles.dateInputs}>
					<div className={styles.dateField}>
						<label className={styles.dateLabel}>Начало</label>
						<input
							type='date'
							className={styles.dateInput}
							value={startDate}
							onChange={e => onStartDateChange(e.target.value)}
						/>
					</div>
					<div className={styles.dateField}>
						<label className={styles.dateLabel}>Конец</label>
						<input
							type='date'
							className={styles.dateInput}
							value={endDate}
							onChange={e => onEndDateChange(e.target.value)}
						/>
					</div>
				</div>
				<div className={styles.datePickerActions}>
					<button
						className={`${styles.datePickerBtn} ${styles.datePickerBtnCancel}`}
						onClick={onCancel}
					>
						Отмена
					</button>
					<button
						className={`${styles.datePickerBtn} ${styles.datePickerBtnApply}`}
						onClick={onApply}
						disabled={!startDate || !endDate}
					>
						Применить
					</button>
				</div>
			</div>
		</>
	)
}
