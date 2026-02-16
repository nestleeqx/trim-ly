import type { ThemeValue } from '@/app/features/profile/api/profileApi'
import cn from 'classnames'
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
					className={cn(styles.themeCard, {
						[styles.selected]: theme === 'light'
					})}
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
					className={cn(styles.themeCard, {
						[styles.selected]: theme === 'dark'
					})}
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
					className={cn(styles.themeCard, {
						[styles.selected]: theme === 'system'
					})}
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
