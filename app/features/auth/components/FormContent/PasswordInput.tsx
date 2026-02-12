import authSharedStyles from '@/app/(auth)/AuthShared.module.scss'
import { usePasswordToggle } from '@/hooks/usePasswordToggle'
import cn from 'classnames'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import styles from './FormContent.module.scss'

interface PasswordInputProps {
	id: string
	label: string
	labelStyle?: 'primary' | 'secondary'
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	autoComplete?: string
	showForgotLink?: boolean
	forgotLinkHref?: string
	forgotLinkText?: string
	forgotLinkClassName?: string
	error?: string
}

export default function PasswordInput({
	id,
	label,
	labelStyle = 'primary',
	placeholder,
	value,
	onChange,
	autoComplete,
	showForgotLink = false,
	forgotLinkHref = '/forgot-password',
	forgotLinkText = 'Забыли пароль?',
	forgotLinkClassName,
	error
}: PasswordInputProps) {
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
					className={cn(styles.label, {
						[styles.labelPrimary]: labelStyle === 'primary',
						[styles.labelSecondary]: labelStyle === 'secondary'
					})}
					htmlFor={id}
				>
					{label}
				</label>
			)}

			<div className={styles.inputWrapper}>
				<input
					id={id}
					name={id}
					type={showPassword ? 'text' : 'password'}
					className={`${styles.input} ${error ? authSharedStyles.inputError : ''}`}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					autoComplete={autoComplete}
					aria-invalid={!!error}
					aria-describedby={error ? `${id}-error` : undefined}
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

			{error && (
				<p
					id={`${id}-error`}
					className={authSharedStyles.errorText}
				>
					{error}
				</p>
			)}
		</div>
	)
}
