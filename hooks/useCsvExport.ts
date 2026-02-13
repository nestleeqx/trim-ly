type CsvConverter<T> = (data: T[]) => string

interface DownloadCsvOptions<T> {
	data: T[]
	filename: string
	converter: CsvConverter<T>
}

const useCsvExport = () => {
	const downloadCsv = <T>({
		data,
		filename,
		converter
	}: DownloadCsvOptions<T>) => {
		const csvContent = converter(data)
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
		downloadCsv
	}
}

export default useCsvExport
