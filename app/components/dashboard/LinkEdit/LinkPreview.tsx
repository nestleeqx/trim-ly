'use client'

import Button from '@/app/components/ui/Button'
import { LinkStatus } from '@/types/links'
import {
	Calendar,
	Copy,
	Download,
	Link2,
	Lock,
	QrCode,
	Tag
} from 'lucide-react'
import React, { useCallback, useState } from 'react'
import styles from './LinkEdit.module.scss'
import { LinkEditFormData, SHORT_LINK_DOMAIN } from './linkEdit.config'

interface LinkPreviewProps {
	formData: LinkEditFormData
	status: LinkStatus
	onCopy: () => void
	onDownloadQr: () => void
}

const statusLabels: Record<LinkStatus, string> = {
	active: 'АКТИВНА',
	paused: 'ПАУЗА',
	expired: 'ИСТЕКЛА',
	deleted: 'УДАЛЕНА'
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
	formData,
	status,
	onCopy,
	onDownloadQr
}) => {
	const [copied, setCopied] = useState(false)

	const shortUrl = formData.shortLink
		? `${SHORT_LINK_DOMAIN}${formData.shortLink}`
		: `${SHORT_LINK_DOMAIN}********`

	const handleCopy = useCallback(() => {
		onCopy()
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}, [onCopy])

	return (
		<div className={styles.preview}>
			<div className={styles.previewHeader}>
				<h3 className={styles.previewTitle}>Предпросмотр</h3>
			</div>
			<div className={styles.previewContent}>
				{/* Short Link */}
				<div className={styles.previewSection}>
					<span className={`${styles.statusBadge} ${styles[status]}`}>
						{statusLabels[status]}
					</span>
					<span className={styles.previewLabel}>КОРОТКАЯ ССЫЛКА</span>
					<div className={styles.shortLinkDisplay}>
						<span className={styles.shortLinkText}>{shortUrl}</span>
						<button
							type='button'
							onClick={handleCopy}
							className={styles.copyBtn}
							title='Копировать'
						>
							<Copy size={16} />
						</button>
					</div>
					{copied && (
						<span className={styles.copiedText}>Скопировано!</span>
					)}
				</div>

				{/* Original URL */}
				<div className={styles.previewSection}>
					<span className={styles.previewLabel}>
						ОРИГИНАЛЬНЫЙ URL
					</span>
					<div className={styles.originalUrl}>
						<Link2
							size={16}
							className={styles.urlIcon}
						/>
						<span className={styles.urlText}>
							{formData.destinationUrl ||
								'https://example.com/long-url'}
						</span>
					</div>
				</div>

				{/* QR Code */}
				<div className={styles.qrSection}>
					<div className={styles.qrInfo}>
						<QrCode
							size={40}
							className={styles.qrIcon}
						/>
						<div className={styles.qrText}>
							<span className={styles.qrTitle}>
								Динамический QR-код
							</span>
							<span className={styles.qrSubtitle}>
								Перенаправляет на целевую ссылку
							</span>
						</div>
					</div>
					<Button
						variant='ghost'
						size='sm'
						onClick={onDownloadQr}
					>
						<Download size={14} />
						Скачать
					</Button>
				</div>
			</div>

			{/* Tags */}
			<div className={styles.previewSection}>
				<div className={styles.previewRow}>
					<div className={styles.previewRowIcon}>
						<Tag size={18} />
					</div>
					<span className={styles.previewRowLabel}>Теги</span>
					<span className={styles.previewRowValue}>
						{formData.tags.length > 0
							? formData.tags.join(', ')
							: 'Нет'}
					</span>
				</div>
			</div>

			{/* Expiration */}
			<div className={styles.previewSection}>
				<div className={styles.previewRow}>
					<div className={styles.previewRowIcon}>
						<Calendar size={18} />
					</div>
					<span className={styles.previewRowLabel}>Истечение</span>
					<span className={styles.previewRowValue}>
						{formData.expirationDate
							? new Date(
									formData.expirationDate
								).toLocaleDateString('ru-RU', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})
							: 'Бессрочно'}
					</span>
				</div>
			</div>

			{/* Password Protection */}
			<div className={styles.previewSection}>
				<div className={styles.previewRow}>
					<div className={styles.previewRowIcon}>
						<Lock size={18} />
					</div>
					<span className={styles.previewRowLabel}>Пароль</span>
					<span className={styles.previewRowValue}>
						{formData.passwordEnabled ? 'Включён' : 'Отключён'}
					</span>
				</div>
			</div>
		</div>
	)
}
