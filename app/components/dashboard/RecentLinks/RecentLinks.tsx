'use client'

import {
	BarChart3,
	Copy,
	Download,
	Edit3,
	ExternalLink,
	Link as LinkIcon,
	MoreVertical,
	Pause,
	Play,
	Plus,
	QrCode,
	Trash2,
	X
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import styles from './RecentLinks.module.scss'

interface LinkItem {
	id: string
	title: string
	icon: string
	shortUrl: string
	clicks: number
	status: 'active' | 'inactive'
	createdAt: string
}

interface RecentLinksProps {
	isLoading?: boolean
	isEmpty?: boolean
}

const linksData: LinkItem[] = [
	{
		id: '1',
		title: 'Black Friday Campaign',
		icon: '📦',
		shortUrl: 's.io/bf-2026',
		clicks: 2314,
		status: 'active',
		createdAt: '2 дня назад'
	},
	{
		id: '2',
		title: 'Summer Launch 2025',
		icon: '☀️',
		shortUrl: 's.io/summer',
		clicks: 1248,
		status: 'active',
		createdAt: '1 неделю назад'
	},
	{
		id: '3',
		title: 'Instagram Bio Link',
		icon: '📷',
		shortUrl: 's.io/ig-profile',
		clicks: 5821,
		status: 'active',
		createdAt: '2 недели назад'
	},
	{
		id: '4',
		title: 'Newsletter Q4 Promo',
		icon: '📧',
		shortUrl: 's.io/news-q4',
		clicks: 4102,
		status: 'active',
		createdAt: '3 недели назад'
	},
	{
		id: '5',
		title: 'Old Referral Program',
		icon: '🎁',
		shortUrl: 's.io/ref-old',
		clicks: 954,
		status: 'inactive',
		createdAt: '2 месяца назад'
	}
]

const SkeletonRow: React.FC = () => (
	<tr className={styles.skeletonRow}>
		<td>
			<div className={styles.skeletonTitle}>
				<div className={`${styles.skeleton} ${styles.skeletonIcon}`} />
				<div
					className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextLg}`}
				/>
			</div>
		</td>
		<td>
			<div
				className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextMd}`}
			/>
		</td>
		<td>
			<div
				className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextSm}`}
			/>
		</td>
		<td>
			<div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
		</td>
		<td>
			<div
				className={`${styles.skeleton} ${styles.skeletonText} ${styles.skeletonTextMd}`}
			/>
		</td>
		<td>
			<div className={styles.skeletonActions}>
				{[1, 2, 3, 4].map(i => (
					<div
						key={i}
						className={`${styles.skeleton} ${styles.skeletonAction}`}
					/>
				))}
			</div>
		</td>
	</tr>
)

const RecentLinks: React.FC<RecentLinksProps> = ({
	isLoading = false,
	isEmpty = false
}) => {
	const router = useRouter()
	const [links, setLinks] = useState<LinkItem[]>(linksData)
	const [showToast, setShowToast] = useState(false)
	const [toastMessage, setToastMessage] = useState('')
	const [openKebabId, setOpenKebabId] = useState<string | null>(null)
	const [qrModalLink, setQrModalLink] = useState<LinkItem | null>(null)

	const showToastMessage = useCallback((message: string) => {
		setToastMessage(message)
		setShowToast(true)
		setTimeout(() => setShowToast(false), 2000)
	}, [])

	const handleRowClick = useCallback(
		(linkId: string, e: React.MouseEvent) => {
			// Don't navigate if clicking on action buttons
			const target = e.target as HTMLElement
			if (target.closest(`.${styles.actions}`)) return

			router.push(`/dashboard/links/${linkId}`)
		},
		[router]
	)

	const handleCopy = useCallback(
		(url: string) => {
			navigator.clipboard.writeText(`https://${url}`)
			showToastMessage('Скопировано!')
		},
		[showToastMessage]
	)

	const handleQrClick = useCallback((link: LinkItem) => {
		setQrModalLink(link)
	}, [])

	const handleAnalyticsClick = useCallback(
		(linkId: string) => {
			router.push(`/analytics?link=${linkId}`)
		},
		[router]
	)

	const handleKebabClick = useCallback(
		(linkId: string, e: React.MouseEvent) => {
			e.stopPropagation()
			setOpenKebabId(openKebabId === linkId ? null : linkId)
		},
		[openKebabId]
	)

	const handleEdit = useCallback(
		(linkId: string) => {
			setOpenKebabId(null)
			router.push(`/dashboard/links/${linkId}/edit`)
		},
		[router]
	)

	const handleToggleStatus = useCallback(
		(linkId: string) => {
			setLinks(prev =>
				prev.map(link =>
					link.id === linkId
						? {
								...link,
								status:
									link.status === 'active'
										? 'inactive'
										: 'active'
							}
						: link
				)
			)
			setOpenKebabId(null)
			showToastMessage('Статус изменён')
		},
		[showToastMessage]
	)

	const handleDuplicate = useCallback(
		(linkId: string) => {
			const linkToDuplicate = links.find(l => l.id === linkId)
			if (linkToDuplicate) {
				const newLink: LinkItem = {
					...linkToDuplicate,
					id: `${Date.now()}`,
					title: `${linkToDuplicate.title} (копия)`,
					shortUrl: `s.io/${Date.now().toString(36)}`,
					clicks: 0,
					createdAt: 'Только что'
				}
				setLinks(prev => [newLink, ...prev])
				showToastMessage('Ссылка скопирована')
			}
			setOpenKebabId(null)
		},
		[links, showToastMessage]
	)

	const handleDelete = useCallback(
		(linkId: string) => {
			setLinks(prev => prev.filter(link => link.id !== linkId))
			setOpenKebabId(null)
			showToastMessage('Ссылка удалена')
		},
		[showToastMessage]
	)

	const handleDownloadQr = useCallback(() => {
		showToastMessage('QR код скачан')
		setQrModalLink(null)
	}, [showToastMessage])

	const handleCopyQrUrl = useCallback(() => {
		if (qrModalLink) {
			navigator.clipboard.writeText(`https://${qrModalLink.shortUrl}`)
			showToastMessage('Скопировано!')
		}
	}, [qrModalLink, showToastMessage])

	// Empty state
	if (isEmpty || (!isLoading && links.length === 0)) {
		return (
			<div className={styles.card}>
				<div className={styles.header}>
					<h3 className={styles.title}>Последние ссылки</h3>
				</div>
				<div className={styles.emptyState}>
					<LinkIcon
						size={48}
						className={styles.emptyIcon}
					/>
					<h4 className={styles.emptyTitle}>Нет ссылок</h4>
					<p className={styles.emptyText}>
						Создайте свою первую короткую ссылку
					</p>
					<Link
						href='/links/new'
						className={styles.emptyBtn}
					>
						<Plus size={18} />
						<span>Создать ссылку</span>
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.card}>
			<div className={styles.header}>
				<h3 className={styles.title}>Последние ссылки</h3>
				<Link
					href='/dashboard/links'
					className={styles.viewAll}
				>
					Смотреть все
				</Link>
			</div>

			<div className={styles.tableWrapper}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th>НАЗВАНИЕ</th>
							<th>КОРОТКИЙ URL</th>
							<th>КЛИКИ</th>
							<th>СТАТУС</th>
							<th>СОЗДАНО</th>
							<th>ДЕЙСТВИЯ</th>
						</tr>
					</thead>
					<tbody>
						{isLoading
							? [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
							: links.map(link => (
									<tr
										key={link.id}
										className={styles.row}
									>
										<td>
											<div className={styles.titleCell}>
												<span className={styles.icon}>
													{link.icon}
												</span>
												<span
													className={styles.linkTitle}
												>
													{link.title}
												</span>
											</div>
										</td>
										<td>
											<a
												href={`https://${link.shortUrl}`}
												target='_blank'
												rel='noopener noreferrer'
												className={styles.shortUrlLink}
											>
												<span
													className={styles.shortUrl}
												>
													{link.shortUrl}
												</span>
												<ExternalLink
													size={14}
													className={
														styles.externalIcon
													}
												/>
											</a>
										</td>
										<td>
											<span className={styles.clicks}>
												{link.clicks.toLocaleString()}
											</span>
										</td>
										<td>
											<span
												className={`${styles.status} ${link.status === 'active' ? styles.active : styles.inactive}`}
											>
												{link.status === 'active'
													? 'Active'
													: 'Inactive'}
											</span>
										</td>
										<td>
											<span className={styles.date}>
												{link.createdAt}
											</span>
										</td>
										<td>
											<div className={styles.actions}>
												<button
													className={styles.actionBtn}
													onClick={() =>
														handleCopy(
															link.shortUrl
														)
													}
													title='Копировать'
												>
													<Copy size={16} />
												</button>
												<button
													className={styles.actionBtn}
													onClick={() =>
														handleQrClick(link)
													}
													title='QR код'
												>
													<QrCode size={16} />
												</button>
												<button
													className={styles.actionBtn}
													onClick={() =>
														handleAnalyticsClick(
															link.id
														)
													}
													title='Аналитика'
												>
													<BarChart3 size={16} />
												</button>
												<div
													className={
														styles.kebabWrapper
													}
												>
													<button
														className={
															styles.actionBtn
														}
														onClick={e =>
															handleKebabClick(
																link.id,
																e
															)
														}
														title='Ещё'
													>
														<MoreVertical
															size={16}
														/>
													</button>
													{openKebabId ===
														link.id && (
														<>
															<div
																className={
																	styles.kebabOverlay
																}
																onClick={e => {
																	e.stopPropagation()
																	setOpenKebabId(
																		null
																	)
																}}
															/>
															<div
																className={
																	styles.kebabMenu
																}
															>
																<button
																	className={
																		styles.kebabItem
																	}
																	onClick={() =>
																		handleEdit(
																			link.id
																		)
																	}
																>
																	<Edit3
																		size={
																			16
																		}
																	/>
																	<span>
																		Редактировать
																	</span>
																</button>
																<button
																	className={
																		styles.kebabItem
																	}
																	onClick={() =>
																		handleToggleStatus(
																			link.id
																		)
																	}
																>
																	{link.status ===
																	'active' ? (
																		<>
																			<Pause
																				size={
																					16
																				}
																			/>
																			<span>
																				Приостановить
																			</span>
																		</>
																	) : (
																		<>
																			<Play
																				size={
																					16
																				}
																			/>
																			<span>
																				Возобновить
																			</span>
																		</>
																	)}
																</button>
																<button
																	className={
																		styles.kebabItem
																	}
																	onClick={() =>
																		handleDuplicate(
																			link.id
																		)
																	}
																>
																	<Copy
																		size={
																			16
																		}
																	/>
																	<span>
																		Дублировать
																	</span>
																</button>
																<div
																	className={
																		styles.kebabDivider
																	}
																/>
																<button
																	className={`${styles.kebabItem} ${styles.danger}`}
																	onClick={() =>
																		handleDelete(
																			link.id
																		)
																	}
																>
																	<Trash2
																		size={
																			16
																		}
																	/>
																	<span>
																		Удалить
																	</span>
																</button>
															</div>
														</>
													)}
												</div>
											</div>
										</td>
									</tr>
								))}
					</tbody>
				</table>
			</div>

			{/* Toast */}
			<div className={`${styles.toast} ${showToast ? styles.show : ''}`}>
				{toastMessage}
			</div>

			{/* QR Modal */}
			{qrModalLink && (
				<div
					className={styles.qrOverlay}
					onClick={() => setQrModalLink(null)}
				>
					<div
						className={styles.qrModal}
						onClick={e => e.stopPropagation()}
					>
						<div className={styles.qrHeader}>
							<h3 className={styles.qrTitle}>QR код</h3>
							<button
								className={styles.qrClose}
								onClick={() => setQrModalLink(null)}
							>
								<X size={20} />
							</button>
						</div>
						<div className={styles.qrContent}>
							<div className={styles.qrCode} />
							<span className={styles.qrUrl}>
								{qrModalLink.shortUrl}
							</span>
							<div className={styles.qrActions}>
								<button
									className={`${styles.qrBtn} ${styles.qrBtnSecondary}`}
									onClick={handleCopyQrUrl}
								>
									<Copy size={16} />
									<span>Копировать URL</span>
								</button>
								<button
									className={`${styles.qrBtn} ${styles.qrBtnPrimary}`}
									onClick={handleDownloadQr}
								>
									<Download size={16} />
									<span>Скачать</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default RecentLinks
