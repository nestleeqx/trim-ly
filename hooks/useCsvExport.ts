import { LinkItem } from '@/app/(dashboard)/dashboard/links/page'

interface ExportOptions {
	includeHeaders?: boolean
	filename?: string
	delimiter?: string
}

const useCsvExport = () => {
	const convertToCsv = (
		data: LinkItem[],
		options: ExportOptions = {}
	): string => {
		const { includeHeaders = true, delimiter = ',' } = options

		const headers = [
			'ID',
			'Название',
			'Короткая ссылка',
			'Назначение',
			'Клики',
			'Статус',
			'Теги',
			'Дата создания',
			'Дата истечения'
		]

		const rows = data.map(item => {
			const row = [
				`"${item.id}"`,
				`"${item.title}"`,
				`"${item.shortUrl}"`,
				`"${item.destination}"`,
				item.clicks.toString(),
				`"${getStatusLabel(item.status)}"`,
				`"${item.tags.join('; ')}"`,
				`"${formatDate(item.createdAt)}"`,
				item.expirationDate
					? `"${formatDate(item.expirationDate)}"`
					: ''
			]
			return row.join(delimiter)
		})

		const csvContent = [
			includeHeaders ? headers.join(delimiter) : '',
			...rows
		]
			.filter(Boolean)
			.join('\n')

		return csvContent
	}

	const getStatusLabel = (status: LinkItem['status']): string => {
		const labels: Record<LinkItem['status'], string> = {
			active: 'Активна',
			paused: 'Пауза',
			expired: 'Истекла'
		}
		return labels[status]
	}

	const formatDate = (date: Date): string => {
		return date.toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const downloadCsv = (data: LinkItem[], options: ExportOptions = {}) => {
		const {
			filename = `links_export_${new Date().toISOString().split('T')[0]}.csv`
		} = options

		const csvContent = convertToCsv(data, options)

		const blob = new Blob(['\ufeff' + csvContent], {
			type: 'text/csv;charset=utf-8;'
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')

		link.setAttribute('href', url)
		link.setAttribute('download', filename)
		link.style.visibility = 'hidden'

		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		URL.revokeObjectURL(url)
	}

	return {
		convertToCsv,
		downloadCsv
	}
}

export default useCsvExport
