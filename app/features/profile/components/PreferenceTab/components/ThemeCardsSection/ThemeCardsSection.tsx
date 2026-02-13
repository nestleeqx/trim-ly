import type { ThemeValue } from '@/app/features/profile/api/profileApi'
import styles from '../../Preference.module.scss'

type Props = {
	theme: ThemeValue
	isSaving: boolean
	onSelectTheme: (theme: ThemeValue) => void
}

export default function ThemeCardsSection({
	theme,
	isSaving,
	onSelectTheme
}: Props) {
	return (
		<>
			<div className={styles.sectionTitle}>Тема</div>
			<div className={styles.appearance}>
				<button
					className={`${styles.themeCard} ${theme === 'light' ? styles.selected : ''}`}
					onClick={() => onSelectTheme('light')}
					aria-pressed={theme === 'light'}
					disabled={isSaving}
					type='button'
				>
					<div className={styles.preview}>
						<div className={styles.previewInnerLight} />
					</div>
					<div className={styles.themeLabel}>Light</div>
				</button>

				<button
					className={`${styles.themeCard} ${theme === 'dark' ? styles.selected : ''}`}
					onClick={() => onSelectTheme('dark')}
					aria-pressed={theme === 'dark'}
					disabled={isSaving}
					type='button'
				>
					<div className={styles.preview}>
						<div className={styles.previewInnerDark} />
					</div>
					<div className={styles.themeLabel}>Dark</div>
				</button>

				<button
					className={`${styles.themeCard} ${theme === 'system' ? styles.selected : ''}`}
					onClick={() => onSelectTheme('system')}
					aria-pressed={theme === 'system'}
					disabled={isSaving}
					type='button'
				>
					<div className={styles.preview}>
						<div className={styles.previewInnerSystem} />
					</div>
					<div className={styles.themeLabel}>System</div>
				</button>
			</div>
		</>
	)
}
