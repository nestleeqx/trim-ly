'use client'

import ClicksChart from '@/app/components/dashboard/ClicksChart'
import DashboardHeader from '@/app/components/dashboard/DashboardHeader'
import DevicesChart from '@/app/components/dashboard/DevicesChart'
import {
	LinkInfoCard,
	LinkStatsCards
} from '@/app/components/dashboard/LinkDetails'
import {
	LinkEditForm,
	LinkEditFormData,
	LinkPreview,
	SHORT_LINK_DOMAIN
} from '@/app/components/dashboard/LinkEdit'
import QrCodeModal from '@/app/components/dashboard/QrCodeModal'
import RawClickEvents from '@/app/components/dashboard/RawClickEvents'
import TopCountries from '@/app/components/dashboard/TopCountries'
import TopReferrers from '@/app/components/dashboard/TopReferrers'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import Toast from '@/app/components/ui/Toast/Toast'
import { mockClickEvents } from '@/data/mockClickEvents'
import {
	mockDeviceStats,
	mockTopCountries,
	mockTopReferrers
} from '@/data/mockDashboardData'
import { mockLinks } from '@/data/mockLinks'
import { getModalConfig, LinkItem, ModalAction } from '@/types/links'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './page.module.scss'

export default function LinkDetailsPage() {
	const params = useParams()
	const router = useRouter()
	const linkId = params.id as string

	const [links, setLinks] = useState<LinkItem[]>(mockLinks)
	const [showQrModal, setShowQrModal] = useState(false)
	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean
		action: ModalAction
	}>({ isOpen: false, action: null })
	const [actionLoading, setActionLoading] = useState(false)
	const [toast, setToast] = useState({
		isVisible: false,
		message: '',
		variant: 'success' as const
	})

	const link = useMemo(
		() => links.find(l => l.id === linkId),
		[links, linkId]
	)

	// Tab handling (analytics | edit)
	const searchParams = useSearchParams()
	const currentTab = (searchParams.get('tab') as string) || 'analytics'

	type BlockState = 'loading' | 'empty' | 'error' | 'ready'
	const [clicksState, setClicksState] = useState<BlockState>('ready')
	const [sideState, setSideState] = useState<BlockState>('ready')
	const [rawState, setRawState] = useState<BlockState>('ready')

	const handleRetry = useCallback((which: 'clicks' | 'side' | 'raw') => {
		if (which === 'clicks') {
			setClicksState('loading')
			setTimeout(() => setClicksState('ready'), 600)
		}
		if (which === 'side') {
			setSideState('loading')
			setTimeout(() => setSideState('ready'), 600)
		}
		if (which === 'raw') {
			setRawState('loading')
			setTimeout(() => setRawState('ready'), 600)
		}
	}, [])

	const showToast = useCallback((message: string) => {
		setToast({ isVisible: true, message, variant: 'success' })
	}, [])

	const hideToast = useCallback(() => {
		setToast(prev => ({ ...prev, isVisible: false }))
	}, [])

	const handleEdit = useCallback(() => {
		router.push(`/links/${linkId}?tab=edit`)
	}, [router, linkId])

	const handlePause = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'pause-single' })
	}, [])

	const handleResume = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'resume-single' })
	}, [])

	const handleDelete = useCallback(() => {
		setConfirmModal({ isOpen: true, action: 'delete-single' })
	}, [])

	const handleDownloadQr = useCallback(() => {
		setShowQrModal(true)
	}, [])

	const handleCopy = useCallback(
		(url: string) => {
			navigator.clipboard.writeText(`https://${url}`)
			showToast('Ссылка скопирована')
		},
		[showToast]
	)

	const handleCloseModal = useCallback(() => {
		setConfirmModal({ isOpen: false, action: null })
	}, [])

	const handleConfirmAction = useCallback(async () => {
		if (!link) return

		setActionLoading(true)

		try {
			await new Promise(resolve => setTimeout(resolve, 500))

			switch (confirmModal.action) {
				case 'pause-single':
					setLinks(prev =>
						prev.map(l =>
							l.id === linkId
								? { ...l, status: 'paused' as const }
								: l
						)
					)
					showToast('Ссылка приостановлена')
					break

				case 'resume-single':
					setLinks(prev =>
						prev.map(l =>
							l.id === linkId
								? { ...l, status: 'active' as const }
								: l
						)
					)
					showToast('Ссылка возобновлена')
					break

				case 'delete-single':
					setLinks(prev => prev.filter(l => l.id !== linkId))
					showToast('Ссылка удалена')
					router.push('/links')
					break
			}

			handleCloseModal()
		} catch {
			setToast({
				isVisible: true,
				message: 'Произошла ошибка',
				variant: 'success'
			})
		} finally {
			setActionLoading(false)
		}
	}, [link, confirmModal.action, linkId, showToast, router, handleCloseModal])

	const handleQrCopy = useCallback(() => {
		if (link) {
			handleCopy(link.shortUrl)
		}
	}, [link, handleCopy])

	const handleQrDownload = useCallback(() => {
		showToast('QR-код сохранён')
		setShowQrModal(false)
	}, [showToast])

	// Edit form state
	const [editFormData, setEditFormData] = useState<LinkEditFormData>({
		destinationUrl: '',
		shortLink: '',
		title: '',
		tags: [],
		folder: 'General',
		expirationDate: '',
		passwordEnabled: false,
		password: ''
	})
	const [saveLoading, setSaveLoading] = useState(false)
	const [isFormDirty, setIsFormDirty] = useState(false)
	const [unsavedModal, setUnsavedModal] = useState<{
		isOpen: boolean
		targetUrl: string | null
	}>({ isOpen: false, targetUrl: null })
	const pendingNavigationRef = useRef<string | null>(null)

	// Update form data when link changes
	useEffect(() => {
		if (link) {
			setEditFormData({
				destinationUrl: link.destination,
				shortLink: link.shortUrl.replace(SHORT_LINK_DOMAIN, ''),
				title: link.title,
				tags: link.tags,
				folder: 'General',
				expirationDate: link.expirationDate
					? link.expirationDate.toISOString().split('T')[0]
					: '',
				passwordEnabled: link.hasPassword || false,
				password: ''
			})
			setIsFormDirty(false)
		}
	}, [link])

	// Handle realtime form changes for preview
	const handleFormChange = useCallback(
		(data: LinkEditFormData, isDirty: boolean) => {
			setEditFormData(data)
			setIsFormDirty(isDirty)
		},
		[]
	)

	// Browser beforeunload warning
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (isFormDirty && currentTab === 'edit') {
				e.preventDefault()
				e.returnValue = ''
			}
		}

		window.addEventListener('beforeunload', handleBeforeUnload)
		return () =>
			window.removeEventListener('beforeunload', handleBeforeUnload)
	}, [isFormDirty, currentTab])

	// Safe navigation helper
	const safeNavigate = useCallback(
		(url: string) => {
			if (isFormDirty && currentTab === 'edit') {
				pendingNavigationRef.current = url
				setUnsavedModal({ isOpen: true, targetUrl: url })
			} else {
				router.push(url)
			}
		},
		[isFormDirty, currentTab, router]
	)

	// Handle unsaved modal actions
	const handleLeaveWithoutSaving = useCallback(() => {
		setIsFormDirty(false)
		setUnsavedModal({ isOpen: false, targetUrl: null })
		if (pendingNavigationRef.current) {
			router.push(pendingNavigationRef.current)
			pendingNavigationRef.current = null
		}
	}, [router])

	const handleStayOnPage = useCallback(() => {
		pendingNavigationRef.current = null
		setUnsavedModal({ isOpen: false, targetUrl: null })
	}, [])

	const handleSaveLink = useCallback(
		async (data: LinkEditFormData) => {
			setSaveLoading(true)
			try {
				await new Promise(resolve => setTimeout(resolve, 500))
				setLinks(prev =>
					prev.map(l =>
						l.id === linkId
							? {
									...l,
									destination: data.destinationUrl,
									shortUrl: `${SHORT_LINK_DOMAIN}${data.shortLink}`,
									title: data.title,
									tags: data.tags,
									expirationDate: data.expirationDate
										? new Date(data.expirationDate)
										: undefined,
									hasPassword: data.passwordEnabled
								}
							: l
					)
				)
				setEditFormData(data)
				setIsFormDirty(false)
				showToast('Ссылка сохранена')
				router.push(`/links/${linkId}?tab=analytics`)
			} catch {
				setToast({
					isVisible: true,
					message: 'Ошибка сохранения',
					variant: 'success'
				})
			} finally {
				setSaveLoading(false)
			}
		},
		[linkId, showToast, router]
	)

	const handleCancelEdit = useCallback(() => {
		safeNavigate(`/links/${linkId}?tab=analytics`)
	}, [safeNavigate, linkId])

	const handlePreviewCopy = useCallback(() => {
		const shortUrl = editFormData.shortLink
			? `${SHORT_LINK_DOMAIN}${editFormData.shortLink}`
			: link?.shortUrl || ''
		navigator.clipboard.writeText(`https://${shortUrl}`)
		showToast('Ссылка скопирована')
	}, [editFormData.shortLink, link?.shortUrl, showToast])

	const modalConfig = getModalConfig(confirmModal.action, 1, link?.title)

	if (!link) {
		return (
			<>
				<DashboardHeader
					title='Ссылка не найдена'
					backHref='/links'
					showCreateButton={false}
				/>
				<div className={styles.content}>
					<p>Запрашиваемая ссылка не существует или была удалена.</p>
				</div>
			</>
		)
	}

	return (
		<>
			<DashboardHeader
				title='Детали ссылки'
				subtitle='Подробная информация о ссылке и её аналитика.'
				backHref='/links'
				showCreateButton={false}
			/>

			<div className={styles.content}>
				<LinkInfoCard
					link={link}
					onEdit={handleEdit}
					onPause={handlePause}
					onResume={handleResume}
					onDelete={handleDelete}
					onDownloadQr={handleDownloadQr}
					onCopy={handleCopy}
					hideEditButton={currentTab === 'edit'}
				/>

				{/* Tabs under LinkInfoCard */}
				<div
					className={styles.tabs}
					role='tablist'
				>
					<button
						className={`${styles.tab} ${currentTab === 'analytics' ? styles.active : ''}`}
						onClick={() =>
							safeNavigate(`/links/${linkId}?tab=analytics`)
						}
						role='tab'
						aria-selected={currentTab === 'analytics'}
					>
						Аналитика
					</button>
					<button
						className={`${styles.tab} ${currentTab === 'edit' ? styles.active : ''}`}
						onClick={() =>
							safeNavigate(`/links/${linkId}?tab=edit`)
						}
						role='tab'
						aria-selected={currentTab === 'edit'}
					>
						Редактирование
					</button>
				</div>
				{currentTab === 'analytics' ? (
					<>
						<LinkStatsCards />
						{/* Clicks block with state handling */}
						<div className={styles.blockWrapper}>
							{clicksState === 'loading' && (
								<div className={styles.skeleton}>
									Loading chart…
								</div>
							)}
							{clicksState === 'empty' && (
								<div className={styles.emptyState}>
									Нет данных для графика
								</div>
							)}
							{clicksState === 'error' && (
								<div className={styles.errorState}>
									<p>Ошибка загрузки графика</p>
									<button
										onClick={() => handleRetry('clicks')}
									>
										Retry
									</button>
								</div>
							)}
							{clicksState === 'ready' && <ClicksChart />}
						</div>

						{/* Side charts */}
						<div className={styles.sideCharts}>
							{sideState === 'loading' && (
								<div className={styles.skeleton}>
									Loading side charts…
								</div>
							)}
							{sideState === 'empty' && (
								<div className={styles.emptyState}>
									Нет данных
								</div>
							)}
							{sideState === 'error' && (
								<div className={styles.errorState}>
									<p>Ошибка загрузки</p>
									<button onClick={() => handleRetry('side')}>
										Retry
									</button>
								</div>
							)}
							{sideState === 'ready' && (
								<>
									<TopCountries
										countries={mockTopCountries}
									/>
									<DevicesChart
										deviceStats={mockDeviceStats}
										mainPercentage={
											mockDeviceStats[0]?.percentage ?? 0
										}
										mainDeviceType={
											mockDeviceStats[0]?.type ?? 'Mobile'
										}
									/>
									<TopReferrers
										referrers={mockTopReferrers}
									/>
								</>
							)}
						</div>

						{/* Raw click events */}
						<div className={styles.blockWrapper}>
							{rawState === 'loading' && (
								<div className={styles.skeleton}>
									Loading events…
								</div>
							)}
							{rawState === 'empty' && (
								<div className={styles.emptyState}>
									Нет событий
								</div>
							)}
							{rawState === 'error' && (
								<div className={styles.errorState}>
									<p>Ошибка загрузки событий</p>
									<button onClick={() => handleRetry('raw')}>
										Retry
									</button>
								</div>
							)}
							{rawState === 'ready' && (
								<RawClickEvents events={mockClickEvents} />
							)}
						</div>
					</>
				) : (
					<div className={styles.editLayout}>
						<LinkEditForm
							link={link}
							onSave={handleSaveLink}
							onCancel={handleCancelEdit}
							onChange={handleFormChange}
							isLoading={saveLoading}
						/>
						<LinkPreview
							formData={editFormData}
							status={link.status}
							onCopy={handlePreviewCopy}
							onDownloadQr={handleDownloadQr}
						/>
					</div>
				)}
			</div>
			{showQrModal && (
				<QrCodeModal
					link={link}
					onClose={() => setShowQrModal(false)}
					onCopyUrl={handleQrCopy}
					onDownload={handleQrDownload}
				/>
			)}

			<ConfirmModal
				isOpen={confirmModal.isOpen}
				onClose={handleCloseModal}
				onConfirm={handleConfirmAction}
				title={modalConfig.title}
				message={modalConfig.message}
				confirmText={modalConfig.confirmText}
				variant={modalConfig.variant}
				loading={actionLoading}
			/>

			<ConfirmModal
				isOpen={unsavedModal.isOpen}
				onClose={handleStayOnPage}
				onConfirm={handleLeaveWithoutSaving}
				title='Несохранённые изменения'
				message='У вас есть несохранённые изменения. Вы уверены, что хотите уйти без сохранения?'
				confirmText='Уйти без сохранения'
				cancelText='Остаться'
				variant='warning'
			/>

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
				variant={toast.variant}
			/>
		</>
	)
}
