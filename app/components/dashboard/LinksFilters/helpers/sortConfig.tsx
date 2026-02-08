import type { SortField, SortOrder } from '@/types/filterLinks'
import {
	ArrowDown,
	ArrowUp,
	BarChart,
	CalendarDays,
	Circle,
	Clock,
	Hash
} from 'lucide-react'

/**
 * Конфиг для каждого поля сортировки
 */
export interface SortOptionConfig {
	field: SortField
	label: string
	icon: React.ReactNode
	subOptions: {
		order: SortOrder
		label: string
	}[]
}

/**
 * Все доступные опции сортировки
 */
export const SORT_OPTIONS: SortOptionConfig[] = [
	{
		field: 'created_date',
		label: 'Дата создания',
		icon: <CalendarDays size={14} />,
		subOptions: [
			{ order: 'desc', label: 'Сначала новые' },
			{ order: 'asc', label: 'Сначала старые' }
		]
	},
	{
		field: 'clicks',
		label: 'Клики',
		icon: <BarChart size={14} />,
		subOptions: [
			{ order: 'desc', label: 'По убыванию' },
			{ order: 'asc', label: 'По возрастанию' }
		]
	},
	{
		field: 'title',
		label: 'Название',
		icon: <Hash size={14} />,
		subOptions: [
			{ order: 'asc', label: 'А-Я' },
			{ order: 'desc', label: 'Я-А' }
		]
	},
	{
		field: 'status',
		label: 'Статус',
		icon: <Circle size={14} />,
		subOptions: [
			{ order: 'asc', label: 'По возрастанию' },
			{ order: 'desc', label: 'По убыванию' }
		]
	},
	{
		field: 'expiration_date',
		label: 'Дата истечения',
		icon: <Clock size={14} />,
		subOptions: [
			{ order: 'desc', label: 'Сначала новые' },
			{ order: 'asc', label: 'Сначала старые' }
		]
	}
]

/**
 * Иконки для порядка сортировки
 */
export const SORT_ORDER_ICONS: Record<SortOrder, React.ReactNode> = {
	asc: <ArrowUp size={12} />,
	desc: <ArrowDown size={12} />
}

/**
 * Найти конфиг сортировки по field
 */
export const getSortOptionConfig = (
	field: SortField
): SortOptionConfig | undefined => {
	return SORT_OPTIONS.find(opt => opt.field === field)
}

/**
 * Получить текстовое описание текущей сортировки
 */
export const getSortLabel = (field: SortField, order: SortOrder): string => {
	const option = getSortOptionConfig(field)
	if (!option) return 'Неизвестно'

	const subOption = option.subOptions.find(sub => sub.order === order)
	return subOption ? `${option.label} (${subOption.label})` : option.label
}
