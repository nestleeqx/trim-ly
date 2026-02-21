import Button from '@/app/components/ui/Button/Button'
import Modal from '@/app/components/ui/Modal/Modal'
import cn from 'classnames'
import { useState } from 'react'
import stylesCommon from '../../../settingsCommon.module.scss'
import styles from './AvatarSection.module.scss'

type UploadMode = 'file' | 'url'

type Props = {
	isOpen: boolean
	isAvatarSaving: boolean
	avatarFileName: string
	avatarInput: string
	avatarInputKey: number
	avatarError: string | null
	onClose: () => void
	onAvatarFileChange: (file: File | null) => void
	onAvatarInputChange: (value: string) => void
	onUploadAvatarFile: () => Promise<boolean>
	onUploadAvatarByUrl: () => Promise<boolean>
}

export default function AvatarUploadModal({
	isOpen,
	isAvatarSaving,
	avatarFileName,
	avatarInput,
	avatarInputKey,
	avatarError,
	onClose,
	onAvatarFileChange,
	onAvatarInputChange,
	onUploadAvatarFile,
	onUploadAvatarByUrl
}: Props) {
	const [mode, setMode] = useState<UploadMode>('file')
	const handleFileUpload = async () => {
		const ok = await onUploadAvatarFile()
		if (ok) onClose()
	}
	const handleUrlUpload = async () => {
		const ok = await onUploadAvatarByUrl()
		if (ok) onClose()
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Изменить аватар'
		>
			<div className={styles.modalBody}>
				<div className={styles.modeTabs}>
					<button
						type='button'
						className={cn(
							styles.modeTab,
							mode === 'file' && styles.activeModeTab
						)}
						onClick={() => setMode('file')}
						disabled={isAvatarSaving}
					>
						Файл
					</button>
					<button
						type='button'
						className={cn(
							styles.modeTab,
							mode === 'url' && styles.activeModeTab
						)}
						onClick={() => setMode('url')}
						disabled={isAvatarSaving}
					>
						Ссылка
					</button>
				</div>

				<div className={styles.uploadPanel}>
					{mode === 'file' ? (
						<>
							<div className={styles.uploadRow}>
								<input
									key={avatarInputKey}
									id='avatar-file-input'
									className={styles.fileInput}
									type='file'
									accept='image/jpeg,image/png,image/webp'
									disabled={isAvatarSaving}
									onChange={e =>
										onAvatarFileChange(
											e.target.files?.[0] ?? null
										)
									}
								/>
								<label
									htmlFor='avatar-file-input'
									className={styles.filePickerBtn}
								>
									Выбрать файл
								</label>
								<span className={styles.fileName}>
									{avatarFileName || 'Файл не выбран'}
								</span>
							</div>
							<Button
								variant='primary'
								onClick={handleFileUpload}
								disabled={isAvatarSaving}
							>
								{isAvatarSaving ? 'Сохраняем...' : 'Загрузить'}
							</Button>
						</>
					) : (
						<>
							<input
								className={stylesCommon.input}
								placeholder='https://...'
								value={avatarInput}
								onChange={e =>
									onAvatarInputChange(e.target.value)
								}
								disabled={isAvatarSaving}
							/>
							<Button
								variant='primary'
								onClick={handleUrlUpload}
								disabled={isAvatarSaving}
							>
								{isAvatarSaving
									? 'Сохраняем...'
									: 'Загрузить по ссылке'}
							</Button>
						</>
					)}
				</div>
				{avatarError && (
					<p className={styles.avatarError}>
						{avatarError}
					</p>
				)}

				<Button
					variant='ghost'
					onClick={onClose}
					disabled={isAvatarSaving}
				>
					Отмена
				</Button>
			</div>
		</Modal>
	)
}
