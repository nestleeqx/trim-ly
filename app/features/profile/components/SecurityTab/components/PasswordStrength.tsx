import cn from 'classnames'
import styles from './PasswordStrength.module.scss'

type Tone = 'weak' | 'medium' | 'strong'

type Props = {
	score: number
	label: string
	tone: Tone
}

export default function PasswordStrength({ score, label, tone }: Props) {
	const normalized = Math.max(0, Math.min(score, 5))
	const percent = `${(normalized / 5) * 100}%`

	return (
		<div className={styles.root}>
			<div className={styles.row}>
				<span className={styles.caption}>Сила пароля</span>
				<span className={cn(styles.value, styles[tone])}>{label}</span>
			</div>
			<div className={styles.track}>
				<div
					className={cn(styles.fill, styles[tone])}
					style={{ width: percent }}
				/>
			</div>
		</div>
	)
}
