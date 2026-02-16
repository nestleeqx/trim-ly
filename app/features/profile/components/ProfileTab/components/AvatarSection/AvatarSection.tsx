import cn from 'classnames'
import Image from 'next/image'
import stylesCommon from '../../../settingsCommon.module.scss'
import styles from './AvatarSection.module.scss'

type Props = {
	avatarURL: string | null
	fallbackInitial: string
	avatarInput: string
	isAvatarSaving: boolean
	onAvatarInputChange: (value: string) => void
	onSetAvatar: () => void
	onRemoveAvatar: () => void
}

export default function AvatarSection({
	avatarURL,
	fallbackInitial,
	avatarInput,
	isAvatarSaving,
	onAvatarInputChange,
	onSetAvatar,
	onRemoveAvatar
}: Props) {
	const canRemoveAvatar = Boolean(avatarURL) && !isAvatarSaving

	return (
		<div className={styles.avatarRow}>
			{avatarURL ? (
				<Image
					src={avatarURL}
					alt='Аватар'
					width={80}
					height={80}
					objectFit='cover'
				/>
			) : (
				<div className={styles.avatarFallback}>
					<span>{fallbackInitial}</span>
				</div>
			)}

			<div className={styles.avatarActions}>
				<div className={styles.avatarHints}>
					<p>Аватар профиля</p>
					<span>
						Временный MVP: вставьте публичный URL изображения.
					</span>
				</div>

				<div className={styles.avatarLinks}>
					<input
						className={stylesCommon.input}
						placeholder='https://...'
						value={avatarInput}
						onChange={e => onAvatarInputChange(e.target.value)}
						disabled={isAvatarSaving}
					/>
					<button
						className={styles.linkBtn}
						onClick={onSetAvatar}
						disabled={isAvatarSaving}
						type='button'
					>
						{isAvatarSaving ? 'Сохраняем...' : 'Изменить'}
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
