import { useState } from 'react'
import stylesCommon from '../../settings/SettingsCommon.module.scss'
import Button from '../../ui/Button'
import TabCard from '../TabCard/TabCard'
import styles from './ProfileTab.module.scss'

export default function ProfileTab() {
	const [fullName, setFullName] = useState('Alex Rivera')
	const [username, setUsername] = useState('@alex')

	const handleSave = () => {
		alert('Сохранено (заглушка)')
	}

	return (
		<TabCard
			title='Информация профиля'
			subtitle='Обновите личные данные и то, как вас видят другие.'
		>
			<>
				<div className={styles.avatarRow}>
					<div className={styles.avatarCircle} />
					<div className={styles.avatarActions}>
						<div className={styles.avatarHints}>
							<p>Аватар профиля</p>
							<span>PNG, JPG или GIF. Максимум 2 МБ.</span>
						</div>
						<div className={styles.avatarLinks}>
							<button className={styles.linkBtn}>Изменить</button>
							<button
								className={`${styles.linkBtn} ${styles.remove}`}
							>
								Удалить
							</button>
						</div>
					</div>
				</div>
				<div className={stylesCommon.formGrid}>
					<div className={stylesCommon.formGroup}>
						<label className={stylesCommon.fieldLabel}>
							ПОЛНОЕ ИМЯ
						</label>
						<input
							className={stylesCommon.input}
							value={fullName}
							onChange={e => setFullName(e.target.value)}
						/>
					</div>
					<div className={stylesCommon.formGroup}>
						<label className={stylesCommon.fieldLabel}>
							ИМЯ ПОЛЬЗОВАТЕЛЯ
						</label>
						<input
							className={stylesCommon.input}
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					</div>
				</div>

				<div className={stylesCommon.formSingle}>
					<label className={stylesCommon.fieldLabel}>
						ЭЛЕКТРОННАЯ ПОЧТА
					</label>
					<input
						className={stylesCommon.input}
						value='alex@rivera.design'
						disabled
					/>
					<div className={stylesCommon.hint}>
						Email нельзя изменить вручную. Пожалуйста, свяжитесь с
						поддержкой.
					</div>
				</div>

				<div className={stylesCommon.actionsRow}>
					<Button
						variant='primary'
						size='md'
						onClick={handleSave}
					>
						Сохранить изменения
					</Button>
				</div>
			</>
		</TabCard>
	)
}
