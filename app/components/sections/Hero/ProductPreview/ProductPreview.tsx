'use client'

import Toast from '@/app/components/ui/Toast/Toast'
import QrCodeModal from '@/app/features/links/components/QrCodeModal/QrCodeModal'
import { downloadQrPng } from '@/app/features/links/utils/downloadQrPng'
import { withQrSource } from '@/app/features/links/utils/qrTracking'
import { toShortLinkHref } from '@/app/features/links/utils/shortLink'
import { useToast } from '@/hooks/useToast'
import { useCallback, useMemo, useState } from 'react'
import ActivityChart from './components/ActivityChart'
import LinksTableHero from './components/LinksTableHero'
import {
	mockChartData,
	mockLinks,
	PreviewTab
} from './components/preview.config'
import PreviewTabs from './components/PreviewTabs'
import QrBadge from './components/QrBadge'
import UrlInput from './components/UrlInput'
import styles from './ProductPreview.module.scss'

export default function ProductPreview() {
	const { toast, showToast, hideToast } = useToast()
	const handleCopy = useCallback(() => {
		showToast('Скопировано!')
	}, [showToast])
	const handleCreate = useCallback(() => {
		showToast('Ссылка создана')
	}, [showToast])
	const [showQrModal, setShowQrModal] = useState(false)
	const [activeTab, setActiveTab] = useState<PreviewTab>('links')
	const landingUrl = useMemo(
		() => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
		[]
	)

	const scrollToAnalytics = useCallback(() => {
		const element = document.getElementById('analytics')
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' })
		}
		setActiveTab('analytics')
	}, [])

	const openQrModal = useCallback(() => setShowQrModal(true), [])
	const closeQrModal = useCallback(() => setShowQrModal(false), [])

	const handleQrDownload = useCallback(async () => {
		try {
			await downloadQrPng({
				value: withQrSource(toShortLinkHref(landingUrl)),
				fileName: 'qr-landing-page.png'
			})
			showToast('QR-код сохранен!')
			closeQrModal()
		} catch {
			showToast('Не удалось скачать QR-код')
		}
	}, [showToast, closeQrModal, landingUrl])

	return (
		<div className={styles.right}>
			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
			/>

			{showQrModal && (
				<QrCodeModal
					url={landingUrl}
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

				<UrlInput onShorten={handleCreate} />

				<LinksTableHero
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
