import { useState } from 'react'
import Button from '../../ui/Button'
import stylesCommon from '../SettingsCommon.module.scss'
import TabCard from '../TabCard/TabCard'
import styles from './Preference.module.scss'

type Theme = 'light' | 'dark' | 'system'

export default function PreferenceTab() {
	const [theme, setTheme] = useState<Theme>('light')

	const save = () => {
		// TODO: persist to settings/context
		alert(`Тема сохранена: ${theme}`)
	}

	return (
		<TabCard
			title='Оформление'
			subtitle='Выберите тему приложения'
		>
			<>
				<div className={styles.sectionTitle}>Тема</div>
				<div className={styles.appearance}>
					<button
						className={`${styles.themeCard} ${theme === 'light' ? styles.selected : ''}`}
						onClick={() => setTheme('light')}
						aria-pressed={theme === 'light'}
					>
						<div className={styles.preview}>
							<div className={styles.previewInnerLight} />
						</div>
						<div className={styles.themeLabel}>Light</div>
					</button>

					<button
						className={`${styles.themeCard} ${theme === 'dark' ? styles.selected : ''}`}
						onClick={() => setTheme('dark')}
						aria-pressed={theme === 'dark'}
					>
						<div className={styles.preview}>
							<div className={styles.previewInnerDark} />
						</div>
						<div className={styles.themeLabel}>Dark</div>
					</button>

					<button
						className={`${styles.themeCard} ${theme === 'system' ? styles.selected : ''}`}
						onClick={() => setTheme('system')}
						aria-pressed={theme === 'system'}
					>
						<div className={styles.preview}>
							<div className={styles.previewInnerSystem} />
						</div>
						<div className={styles.themeLabel}>System</div>
					</button>
				</div>
				<div className={stylesCommon.actionsRow}>
					<Button
						variant='primary'
						onClick={save}
					>
						Сохранить оформление
					</Button>
				</div>
			</>
		</TabCard>
	)
}
