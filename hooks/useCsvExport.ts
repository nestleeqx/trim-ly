interface ExportOptions {
	includeHeaders?: boolean
	filename?: string
	delimiter?: string
}

// Make the hook generic
const useCsvExport = <T extends unknown>(
	data: T[],
	defaultFilename: string,
	converter: (data: T[]) => string // Generic converter function
) => {
	const downloadCsv = (options: ExportOptions = {}) => {
		const {
			filename = `${defaultFilename}_${new Date().toISOString().split('T')[0]}.csv`
		} = options

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
