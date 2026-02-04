'use client'

import { Calendar } from 'lucide-react'
import commonStyles from '../filterCommon.module.scss'
import FilterDropdown from '../FilterDropdown/FilterDropdown'
import styles from './DateFilter.module.scss'

interface DateFilterProps {
	datePreset: '7d' | '30d' | 'custom' | null
	onDatePresetChange: (preset: '7d' | '30d' | 'custom' | null) => void
	startDate: string
	endDate: string
	customDateLabel: string
	onStartDateChange: (date: string) => void
	onEndDateChange: (date: string) => void
	onCustomDateLabelChange: (label: string) => void
	showDatePicker: boolean
	onShowDatePickerChange: (show: boolean) => void
}

const DateFilter: React.FC<DateFilterProps> = ({
	datePreset,
	onDatePresetChange,
	startDate,
	endDate,
	customDateLabel,
	onStartDateChange,
	onEndDateChange,
	onCustomDateLabelChange,
	showDatePicker,
	onShowDatePickerChange
}) => {
	const getDateLabel = () => {
		if (datePreset === '7d') return '7 дней'
		if (datePreset === '30d') return '30 дней'
		if (datePreset === 'custom' && customDateLabel) return customDateLabel
		return 'Период'
	}

	const handlePresetSelect = (preset: '7d' | '30d' | 'custom' | null) => {
		if (preset === 'custom') {
			onShowDatePickerChange(true)
			return
		}
		onDatePresetChange(preset)
	}

	const handleApplyCustomRange = () => {
		if (!startDate || !endDate) return

		const start = new Date(startDate)
		const end = new Date(endDate)

		const formatDate = (date: Date) => {
			return date.toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'short'
			})
		}

		onCustomDateLabelChange(`${formatDate(start)} — ${formatDate(end)}`)
		onDatePresetChange('custom')
		onShowDatePickerChange(false)
	}

	const handleCancelDatePicker = () => {
		onShowDatePickerChange(false)
		if (datePreset !== 'custom') {
			onStartDateChange('')
			onEndDateChange('')
		}
	}

	return (
		<>
			<div className={styles.wrapper}>
				<FilterDropdown
					label={getDateLabel()}
					icon={<Calendar size={14} />}
					hasSelection={datePreset !== null}
					onClose={() => onShowDatePickerChange(false)}
				>
					<button
						className={`${commonStyles.dropdownItem} ${datePreset === null ? commonStyles.selected : ''}`}
						onClick={() => handlePresetSelect(null)}
					>
						Все время
					</button>
					<button
						className={`${commonStyles.dropdownItem} ${datePreset === '7d' ? commonStyles.selected : ''}`}
						onClick={() => handlePresetSelect('7d')}
					>
						7 дней
					</button>
					<button
						className={`${commonStyles.dropdownItem} ${datePreset === '30d' ? commonStyles.selected : ''}`}
						onClick={() => handlePresetSelect('30d')}
					>
						30 дней
					</button>
					<div className={styles.dropdownDivider} />
					<button
						className={`${commonStyles.dropdownItem} ${datePreset === 'custom' ? commonStyles.selected : ''}`}
						onClick={() => handlePresetSelect('custom')}
					>
						<Calendar size={14} />
						Выбрать период...
					</button>
				</FilterDropdown>
			</div>

			{showDatePicker && (
				<>
					<div
						className={styles.datePickerOverlay}
						onClick={handleCancelDatePicker}
					/>
					<div className={styles.datePicker}>
						<div className={styles.datePickerTitle}>
							Выберите период
						</div>
						<div className={styles.dateInputs}>
							<div className={styles.dateField}>
								<label className={styles.dateLabel}>
									Начало
								</label>
								<input
									type='date'
									className={styles.dateInput}
									value={startDate}
									onChange={e =>
										onStartDateChange(e.target.value)
									}
								/>
							</div>
							<div className={styles.dateField}>
								<label className={styles.dateLabel}>
									Конец
								</label>
								<input
									type='date'
									className={styles.dateInput}
									value={endDate}
									onChange={e =>
										onEndDateChange(e.target.value)
									}
								/>
							</div>
						</div>
						<div className={styles.datePickerActions}>
							<button
								className={`${styles.datePickerBtn} ${styles.datePickerBtnCancel}`}
								onClick={handleCancelDatePicker}
							>
								Отмена
							</button>
							<button
								className={`${styles.datePickerBtn} ${styles.datePickerBtnApply}`}
								onClick={handleApplyCustomRange}
								disabled={!startDate || !endDate}
							>
								Применить
							</button>
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default DateFilter
