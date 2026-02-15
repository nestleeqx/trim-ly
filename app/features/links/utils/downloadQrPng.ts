import QRCode from 'qrcode'

export async function buildQrImageUrl(value: string, size = 1024) {
	return QRCode.toDataURL(value, {
		width: size,
		margin: 2,
		errorCorrectionLevel: 'M'
	})
}

export async function downloadQrPng(params: {
	value: string
	fileName?: string
	size?: number
}) {
	const { value, fileName = 'qr-code.png', size = 1024 } = params
	const qrDataUrl = await buildQrImageUrl(value, size)

	const anchor = document.createElement('a')
	anchor.href = qrDataUrl
	anchor.download = fileName
	document.body.appendChild(anchor)
	anchor.click()
	anchor.remove()
}
