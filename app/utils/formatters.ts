export const formatDate = (date: Date): string => {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const days = Math.floor(diff / (1000 * 60 * 60 * 24))

	if (days === 0) return 'Сегодня'
	if (days === 1) return 'Вчера'
	if (days < 7) return `${days} дн. назад`
	if (days < 30) return `${Math.floor(days / 7)} нед. назад`
	if (days < 365) return `${Math.floor(days / 30)} мес. назад`
	return date.toLocaleDateString('ru-RU')
}
