import { usePasswordToggle } from '@/hooks/usePasswordToggle'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import styles from './AuthShared.module.scss'

interface PasswordInputProps {
	id: string
	label: string
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
	showForgotLink?: boolean
	forgotLinkHref?: string
	forgotLinkText?: string
	forgotLinkClassName?: string
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
	id,
	label,
	placeholder,
	value,
	onChange,
	autoComplete,
	showForgotLink = false,
	forgotLinkHref = '/forgot-password',
	forgotLinkText = 'Забыли пароль?',
	forgotLinkClassName
}) => {
	const { showPassword, togglePassword } = usePasswordToggle()

	return (
		<div className={styles.formGroup}>
			{showForgotLink ? (
				<div className={styles.labelRow}>
					<label
						className={styles.label}
						htmlFor={id}
					>
						{label}
					</label>
					<Link
						href={forgotLinkHref}
						className={forgotLinkClassName}
					>
						{forgotLinkText}
					</Link>
				</div>
			) : (
				<label
					className={styles.label}
					htmlFor={id}
				>
					{label}
				</label>
			)}
			<div className={styles.inputWrapper}>
				<input
					id={id}
					type={showPassword ? 'text' : 'password'}
					className={styles.input}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					autoComplete={autoComplete}
				/>
				<button
					type='button'
					className={styles.passwordToggle}
					onClick={togglePassword}
					aria-label={
						showPassword ? 'Скрыть пароль' : 'Показать пароль'
					}
				>
					{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
				</button>
			</div>
		</div>
	)
}
