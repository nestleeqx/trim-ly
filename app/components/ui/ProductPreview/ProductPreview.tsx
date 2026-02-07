'use client'

import { useCallback, useState } from 'react'
import QrCodeModal from '../../dashboard/QrCodeModal'
import Toast from '../Toast'
import { ActivityChart } from './ActivityChart'
import { LinksTable } from './LinksTable'
import { PreviewTabs } from './PreviewTabs'
import styles from './ProductPreview.module.scss'
import { mockChartData, mockLinks, PreviewTab } from './preview.config'
import { QrBadge } from './QrBadge'
import { UrlInput } from './UrlInput'

const QR_SLUG = 'trim.ly/launch-v2'

export default function ProductPreview() {
	const [toast, setToast] = useState({ show: false, message: '' })
	const [showQrModal, setShowQrModal] = useState(false)
	const [activeTab, setActiveTab] = useState<PreviewTab>('links')

	const showToast = useCallback((message: string) => {
		setToast({ show: true, message })
	}, [])

	const closeToast = useCallback(() => {
		setToast(prev => ({ ...prev, show: false }))
	}, [])

	const handleCopy = useCallback(
		(slug: string) => {
			navigator.clipboard.writeText(`https://${slug}`)
			showToast('Скопировано!')
		},
		[showToast]
	)

	const scrollToAnalytics = useCallback(() => {
		const element = document.getElementById('analytics')
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
		setActiveTab('analytics')
	}, [])

	const handleShorten = useCallback(() => {
		showToast('Ссылка создана!')
	}, [showToast])

	const openQrModal = useCallback(() => setShowQrModal(true), [])
	const closeQrModal = useCallback(() => setShowQrModal(false), [])

	const handleQrDownload = useCallback(() => {
		showToast('QR-код сохранен!')
		closeQrModal()
	}, [showToast, closeQrModal])

	return (
		<div className={styles.right}>
			<Toast message={toast.message} isVisible={toast.show} onClose={closeToast} />

			{showQrModal && (
				<QrCodeModal
					url={QR_SLUG}
					onClose={closeQrModal}
					onDownload={handleQrDownload}
				/>
			)}

			<div className={styles.dashboard}>
				<div className={styles.dashboardHeader}>
					<PreviewTabs
						activeTab={activeTab}
						onTabChange={setActiveTab}
						onAnalyticsClick={scrollToAnalytics}
					/>
				</div>

				<UrlInput onShorten={handleShorten} />

				<LinksTable
					links={mockLinks}
					onCopy={handleCopy}
					onAnalyticsClick={scrollToAnalytics}
				/>

				<ActivityChart
					data={mockChartData}
					onAnalyticsClick={scrollToAnalytics}
				/>

				<QrBadge onClick={openQrModal} />
			</div>
		</div>
	)
}
