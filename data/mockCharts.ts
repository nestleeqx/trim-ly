import { ChartDataPoint } from '@/types/charts'

export type Period = '7d' | '30d' | '90d' | 'custom'

export const chartDataByPeriod: Record<Period, ChartDataPoint[]> = {
	'7d': [
		{ day: 'Пн', date: '27 янв', value: 480, unique: 320 },
		{ day: 'Вт', date: '28 янв', value: 620, unique: 410 },
		{ day: 'Ср', date: '29 янв', value: 580, unique: 390 },
		{ day: 'Чт', date: '30 янв', value: 890, unique: 620 },
		{ day: 'Пт', date: '31 янв', value: 1150, unique: 780 },
		{ day: 'Сб', date: '1 фев', value: 1050, unique: 720 },
		{ day: 'Вс', date: '2 фев', value: 1380, unique: 950 }
	],
	'30d': [
		{ day: '1 нед', date: '6-12 янв', value: 3200, unique: 2100 },
		{ day: '2 нед', date: '13-19 янв', value: 4100, unique: 2800 },
		{ day: '3 нед', date: '20-26 янв', value: 3800, unique: 2500 },
		{ day: '4 нед', date: '27 янв - 2 фев', value: 6150, unique: 4200 }
	],
	'90d': [
		{ day: 'Ноя', date: 'Ноябрь', value: 12400, unique: 8200 },
		{ day: 'Дек', date: 'Декабрь', value: 15800, unique: 10500 },
		{ day: 'Янв', date: 'Январь', value: 17250, unique: 11800 }
	],
	custom: [
		{ day: 'Пн', date: '27 янв', value: 480, unique: 320 },
		{ day: 'Вт', date: '28 янв', value: 620, unique: 410 },
		{ day: 'Ср', date: '29 янв', value: 580, unique: 390 },
		{ day: 'Чт', date: '30 янв', value: 890, unique: 620 },
		{ day: 'Пт', date: '31 янв', value: 1150, unique: 780 },
		{ day: 'Сб', date: '1 фев', value: 1050, unique: 720 },
		{ day: 'Вс', date: '2 фев', value: 1380, unique: 950 }
	]
}

export const statsByPeriod: Record<Period, { total: string; average: string }> =
	{
		'7d': { total: '6 150', average: '879' },
		'30d': { total: '17 250', average: '575' },
		'90d': { total: '45 450', average: '505' },
		custom: { total: '6 150', average: '879' }
	}
