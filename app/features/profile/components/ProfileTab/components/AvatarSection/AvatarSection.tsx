import cn from 'classnames'
import Image from 'next/image'
import stylesCommon from '../../../settingsCommon.module.scss'
import styles from './AvatarSection.module.scss'

type Props = {
	avatarURL: string | null
	fallbackInitial: string
	avatarFileName: string
	avatarInputKey: number
	isAvatarSaving: boolean
	onAvatarFileChange: (file: File | null) => void
	onSetAvatar: () => void
	onRemoveAvatar: () => void
}

export default function AvatarSection({
	avatarURL,
	fallbackInitial,
	avatarFileName,
	avatarInputKey,
	isAvatarSaving,
	onAvatarFileChange,
	onSetAvatar,
	onRemoveAvatar
}: Props) {
	const canRemoveAvatar = Boolean(avatarURL) && !isAvatarSaving

	return (
		<div className={styles.avatarRow}>
			{avatarURL ? (
				<div className={styles.avatarImgWrap}>
					<Image
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

			<div className={styles.avatarActions}>
				<div className={styles.avatarHints}>
					<p>Аватар профиля</p>
					<span>Поддерживаются JPG, PNG, WEBP. Максимум 2MB.</span>
				</div>

				<div className={styles.avatarLinks}>
					<input
						key={avatarInputKey}
						className={stylesCommon.input}
						type='file'
						accept='image/jpeg,image/png,image/webp'
						disabled={isAvatarSaving}
						onChange={e =>
							onAvatarFileChange(e.target.files?.[0] ?? null)
						}
					/>
					<span className={styles.fileName}>
						{avatarFileName || 'Файл не выбран'}
					</span>
					<button
						className={styles.linkBtn}
						onClick={onSetAvatar}
						disabled={isAvatarSaving}
						type='button'
					>
						{isAvatarSaving ? 'Сохраняем...' : 'Загрузить'}
					</button>
					<button
						className={cn(styles.linkBtn, styles.remove)}
						onClick={() => {
							if (!canRemoveAvatar) return
							onRemoveAvatar()
						}}
						disabled={isAvatarSaving}
						aria-disabled={!canRemoveAvatar}
						type='button'
					>
						Удалить
					</button>
				</div>
			</div>
		</div>
	)
}
