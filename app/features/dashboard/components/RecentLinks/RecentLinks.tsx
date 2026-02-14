'use client'

import Toast from '@/app/components/ui/Toast/Toast'
import ConfirmModal from '@/app/features/links/components/ConfirmModal/ConfirmModal'
import LinksPageSkeleton from '@/app/features/links/components/LinksPageSkeleton/LinksPageSkeleton'
import {
	deleteLink,
	getLinks,
	patchLinkStatus
} from '@/app/features/links/api/linksApi'
import LinksTable from '@/app/features/links/components/LinksTable/LinksTable'
import { mapLinkDtoToItem } from '@/app/features/links/mappers/linkMappers'
import { useToast } from '@/hooks/useToast'
import { LinkItem } from '@/types/links'
import { Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './RecentLinks.module.scss'

interface RecentLinksProps {
	links?: LinkItem[]
	isLoading?: boolean
	isEmpty?: boolean
	limit?: number
}

type ConfirmAction = 'delete' | 'pause' | 'resume' | 'restore' | null

const RECENT_LINKS_LIMIT = 5

export default function RecentLinks({
	links: externalLinks,
	isLoading = false,
	isEmpty = false,
	limit = RECENT_LINKS_LIMIT
}: RecentLinksProps) {
	const router = useRouter()
	const pathname = usePathname()
	const { toast, showToast, hideToast } = useToast()

	const [fetchedLinks, setFetchedLinks] = useState<LinkItem[]>([])
	const [isFetching, setIsFetching] = useState(!externalLinks)
	const [hasFetchedOnce, setHasFetchedOnce] = useState(false)
	const [fetchError, setFetchError] = useState<string | null>(null)
	const [reloadKey, setReloadKey] = useState(0)

	const [confirmModal, setConfirmModal] = useState<{
		isOpen: boolean
		action: ConfirmAction
		linkId: string | null
		linkTitle: string
	}>({
		isOpen: false,
		action: null,
		linkId: null,
		linkTitle: ''
	})
	const [actionLoading, setActionLoading] = useState(false)

	const loadRecentLinks = useCallback(
		async (signal?: AbortSignal) => {
			setIsFetching(true)
			setFetchError(null)
			try {
				const response = await getLinks({
					page: 1,
					pageSize: limit,
					sort: 'created_date',
					order: 'desc',
					signal
				})
				setFetchedLinks(response.links.map(mapLinkDtoToItem))
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') return
				setFetchError(
					error instanceof Error
						? error.message
						: 'Не удалось загрузить последние ссылки.'
				)
			} finally {
				if (signal?.aborted) return
				setHasFetchedOnce(true)
				setIsFetching(false)
			}
		},
		[limit]
	)

	useEffect(() => {
		if (externalLinks) return
		if (pathname !== '/dashboard') return
		setHasFetchedOnce(false)
		setIsFetching(true)
		const controller = new AbortController()
		void loadRecentLinks(controller.signal)
		return () => controller.abort()
	}, [externalLinks, loadRecentLinks, reloadKey, pathname])

	const links = useMemo(
		() => (externalLinks ?? fetchedLinks).slice(0, limit),
		[externalLinks, fetchedLinks, limit]
	)
	const resolvedLoading = externalLinks ? isLoading : isFetching || !hasFetchedOnce
	const resolvedEmpty =
		isEmpty || (!resolvedLoading && hasFetchedOnce && links.length === 0)

	const getLinkTitle = useCallback(
		(id: string) => links.find(link => link.id === id)?.title || 'Без названия',
		[links]
	)

	const handleCopy = useCallback(
		(_shortUrl: string) => showToast('Ссылка скопирована'),
		[showToast]
	)

	const openPauseConfirm = useCallback(
		(id: string) => {
			setConfirmModal({
				isOpen: true,
				action: 'pause',
				linkId: id,
				linkTitle: getLinkTitle(id)
			})
		},
		[getLinkTitle]
	)

	const openResumeConfirm = useCallback(
		(id: string) => {
			setConfirmModal({
				isOpen: true,
				action: 'resume',
				linkId: id,
				linkTitle: getLinkTitle(id)
			})
		},
		[getLinkTitle]
	)

	const openRestoreConfirm = useCallback(
		(id: string) => {
			setConfirmModal({
				isOpen: true,
				action: 'restore',
				linkId: id,
				linkTitle: getLinkTitle(id)
			})
		},
		[getLinkTitle]
	)

	const openDeleteConfirm = useCallback(
		(id: string) => {
			setConfirmModal({
				isOpen: true,
				action: 'delete',
				linkId: id,
				linkTitle: getLinkTitle(id)
			})
		},
		[getLinkTitle]
	)

	const handleEdit = useCallback(
		(id: string) => {
			router.push(`/links/${id}`)
		},
		[router]
	)

	const closeConfirmModal = useCallback(() => {
		if (actionLoading) return
		setConfirmModal({
			isOpen: false,
			action: null,
			linkId: null,
			linkTitle: ''
		})
	}, [actionLoading])

	const handleConfirmAction = useCallback(async () => {
		if (!confirmModal.linkId || !confirmModal.action) return

		setActionLoading(true)
		try {
			if (confirmModal.action === 'pause') {
				await patchLinkStatus(confirmModal.linkId, 'pause')
				showToast('Ссылка приостановлена')
			} else if (confirmModal.action === 'resume') {
				await patchLinkStatus(confirmModal.linkId, 'resume')
				showToast('Ссылка возобновлена')
			} else if (confirmModal.action === 'restore') {
				await patchLinkStatus(confirmModal.linkId, 'restore')
				showToast('Ссылка восстановлена')
			} else {
				await deleteLink(confirmModal.linkId)
				showToast('Ссылка удалена')
			}

			if (!externalLinks) setReloadKey(prev => prev + 1)
			closeConfirmModal()
		} catch (error) {
			showToast(
				error instanceof Error ? error.message : 'Ошибка операции',
				'error'
			)
		} finally {
			setActionLoading(false)
		}
	}, [confirmModal, closeConfirmModal, showToast, externalLinks])

	if (resolvedEmpty) {
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
			{fetchError ? (
				<div className={styles.emptyState}>
					<h4 className={styles.emptyTitle}>Не удалось загрузить ссылки</h4>
					<p className={styles.emptyText}>{fetchError}</p>
					<button
						type='button'
						className={styles.emptyBtn}
						onClick={() => {
							if (!externalLinks) setReloadKey(prev => prev + 1)
						}}
					>
						Повторить
					</button>
				</div>
			) : resolvedLoading ? (
				<LinksPageSkeleton
					rows={limit}
					showFilters={false}
					showPagination={false}
					embedded
				/>
			) : (
				<LinksTable
					links={links}
					selectedLinks={[]}
					onSelectAll={() => {}}
					onSelectLink={() => {}}
					onCopy={handleCopy}
					onEdit={handleEdit}
					onDelete={openDeleteConfirm}
					onPause={openPauseConfirm}
					onResume={openResumeConfirm}
					onRestore={openRestoreConfirm}
					allowSelection={false}
					showTrend={false}
					showActions
					title='Последние ссылки'
					allLinksHref='/links'
				/>
			)}

			<ConfirmModal
				isOpen={confirmModal.isOpen}
				onClose={closeConfirmModal}
				onConfirm={() => void handleConfirmAction()}
				title={
					confirmModal.action === 'pause'
						? 'Приостановить ссылку'
						: confirmModal.action === 'resume'
							? 'Возобновить ссылку'
							: confirmModal.action === 'restore'
								? 'Восстановить ссылку'
								: 'Удалить ссылку'
				}
				message={
					confirmModal.action === 'pause'
						? `Вы уверены, что хотите приостановить ссылку "${confirmModal.linkTitle}"?`
						: confirmModal.action === 'resume'
							? `Вы уверены, что хотите возобновить ссылку "${confirmModal.linkTitle}"?`
							: confirmModal.action === 'restore'
								? `Вы уверены, что хотите восстановить ссылку "${confirmModal.linkTitle}"?`
								: `Вы уверены, что хотите удалить ссылку "${confirmModal.linkTitle}"? Это действие необратимо.`
				}
				confirmText={
					confirmModal.action === 'pause'
						? 'Приостановить'
						: confirmModal.action === 'resume'
							? 'Возобновить'
							: confirmModal.action === 'restore'
								? 'Восстановить'
								: 'Удалить'
				}
				variant={
					confirmModal.action === 'delete' ? 'danger' : 'warning'
				}
				loading={actionLoading}
			/>

			<Toast
				message={toast.message}
				isVisible={toast.isVisible}
				onClose={hideToast}
				variant={toast.variant}
			/>
		</div>
	)
}
