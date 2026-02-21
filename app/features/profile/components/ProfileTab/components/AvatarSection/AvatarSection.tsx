import Button from '@/app/components/ui/Button/Button'
import cn from 'classnames'
import { useCallback, useState } from 'react'
import AvatarUploadModal from './AvatarUploadModal'
import styles from './AvatarSection.module.scss'

type Props = {
	avatarURL: string | null
	fallbackInitial: string
	avatarFileName: string
	avatarInput: string
	avatarInputKey: number
	avatarError: string | null
	isAvatarSaving: boolean
	onAvatarFileChange: (file: File | null) => void
	onAvatarInputChange: (value: string) => void
	onUploadAvatarFile: () => Promise<boolean>
	onUploadAvatarByUrl: () => Promise<boolean>
	onRemoveAvatar: () => void
}

export default function AvatarSection({
	avatarURL,
	fallbackInitial,
	avatarFileName,
	avatarInput,
	avatarInputKey,
	avatarError,
	isAvatarSaving,
	onAvatarFileChange,
	onAvatarInputChange,
	onUploadAvatarFile,
	onUploadAvatarByUrl,
	onRemoveAvatar
}: Props) {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const canRemoveAvatar = Boolean(avatarURL) && !isAvatarSaving

	const handleCloseModal = useCallback(() => {
		if (isAvatarSaving) return
		setIsModalOpen(false)
	}, [isAvatarSaving])

	return (
		<div className={styles.avatarRow}>
			<div className={styles.avatarVisual}>
				{avatarURL ? (
					<div className={styles.avatarImgWrap}>
						<img
							key={avatarURL}
							src={avatarURL}
							alt='Аватар'
							width={80}
							height={80}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</div>
				) : (
					<div className={styles.avatarFallback}>
						<span>{fallbackInitial}</span>
					</div>
				)}
				{isAvatarSaving && (
					<div className={styles.avatarLoader} aria-hidden='true'>
						<div className={styles.avatarSpinner} />
					</div>
				)}
			</div>

			<div className={styles.avatarActions}>
				<div className={styles.avatarHints}>
					<p>Аватар профиля</p>
					<span>JPG, PNG, WEBP. Размер до 2MB.</span>
				</div>

				<div className={styles.mainActions}>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setIsModalOpen(true)}
						disabled={isAvatarSaving}
					>
						Изменить аватар
					</Button>
					{canRemoveAvatar && (
						<button
							className={cn(styles.linkBtn, styles.remove)}
							onClick={() => onRemoveAvatar()}
							disabled={isAvatarSaving}
							aria-disabled={!canRemoveAvatar}
							type='button'
						>
							Удалить
						</button>
					)}
				</div>
			</div>

			<AvatarUploadModal
				isOpen={isModalOpen}
				isAvatarSaving={isAvatarSaving}
				avatarFileName={avatarFileName}
				avatarInput={avatarInput}
				avatarInputKey={avatarInputKey}
				avatarError={avatarError}
				onClose={handleCloseModal}
				onAvatarFileChange={onAvatarFileChange}
				onAvatarInputChange={onAvatarInputChange}
				onUploadAvatarFile={onUploadAvatarFile}
				onUploadAvatarByUrl={onUploadAvatarByUrl}
			/>
		</div>
	)
}
